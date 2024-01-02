
"use client"
import { DashboardHeader } from "@/components/dashboard/header"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/shared/icons"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export function DocsHeader({project, items}) {
  return (
    <div className="">
            <DashboardHeader heading={project!.name} text={project?.websiteUrl}>
      </DashboardHeader>
      <Card className=" mt-2 flex h-max    w-max items-center ">
        <CardContent className="flex  items-center px-1 pb-0">
  <nav className=" my-1  flex items-start gap-2 ">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"]
        return (
          item.href && (
            <Link key={index} href={item.disabled ? "/" :"/dashboard/"+ project?.id+ item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  "path" === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 size-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        )
      })}
    </nav>
</CardContent>
        </Card>
    </div>
  )
}
