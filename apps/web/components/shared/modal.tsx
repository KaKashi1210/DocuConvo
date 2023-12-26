'use client'

import useMediaQuery from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { Drawer } from 'vaul'

import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ModalProps {
  children: React.ReactNode
  className?: string
  showModal: boolean
  setShowModal: () => void
}

export function Modal({
  children,
  className,
  showModal,
  setShowModal
}: ModalProps) {
  const { isMobile } = useMediaQuery()

  if (isMobile) {
    return (
      <Drawer.Root open={showModal} onClose={setShowModal}>
        <Drawer.Overlay className='fixed inset-0 z-40 bg-background/80 backdrop-blur-sm' />
        <Drawer.Portal>
          <Drawer.Content
            className={cn(
              'fixed inset-x-0 bottom-0 z-50 mt-24 p-6 overflow-hidden rounded-t-2xl border bg-background',
              className
            )}
          >
            <div className='sticky top-0 z-20 flex w-full items-center justify-center bg-inherit'>
              <div className='my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20' />
            </div>
            {children}
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    )
  }
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className='p-12 md:max-w-xl md:max-h-fit md:rounded-2xl md:border'>
        {children}
      </DialogContent>
    </Dialog>
  )
}
