import { HuggingFaceInferenceEmbeddings } from 'langchain/embeddings/hf'
import { PineconeStore } from 'langchain/vectorstores/pinecone'

import { pinecone } from './pinecone'
import { DocMetadata } from '../types/docs'
import { type Config } from '../config'

// TODO: handle when vector store is not pinecone
// TODO: handle when embeddings are stored already
export async function generateEmbeddings(
  dataset: DocMetadata[],
  config: Config
) {
  const { isExist } = await checkIfEmbeddingsExist(config)
  const pineconeIndex = await pinecone.Index(config.pinecone?.indexName!)

  const embeddings = new HuggingFaceInferenceEmbeddings({
    model: config.huggingface?.embeddingModel,
    apiKey: config.huggingface?.apiKey
  })

  if (isExist) {
    // delete existing embeddings
    // TODO: Delete for same urls only not for all (org and project)
    // TODO: Filters in this operation are not supported 'Starter'
    // TODO: Switch to supabase or Use deleteAll for now (self-host)
    pineconeIndex.deleteAll()
  }

  await PineconeStore.fromTexts(
    dataset.map((data) => data.text!),
    dataset.map((data) => {
      return {
        url: data.url,
        org: config.org.name,
        project: config.org.projectName
      }
    }),
    embeddings,
    { pineconeIndex }
  )
}

export async function checkIfEmbeddingsExist(config: Config) {
  const pineconeIndex = await pinecone.Index(config.pinecone?.indexName!)

  const embeddings = new HuggingFaceInferenceEmbeddings({
    model: config.huggingface?.embeddingModel,
    apiKey: config.huggingface?.apiKey
  })

  const { totalRecordCount } = await pineconeIndex.describeIndexStats()

  if (totalRecordCount && totalRecordCount > 0) {
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex
    })

    const results = await vectorStore.similaritySearch('', 1000, {
      org: config.org.name,
      project: config.org.projectName
    })

    if (results.length > 0) {
      return { isExist: true, count: results.length }
    }
  }
  return { isExist: false, count: 0 }
}