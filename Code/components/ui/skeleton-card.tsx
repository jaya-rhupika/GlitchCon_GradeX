import type React from "react"
import { cn } from "@/lib/utils"

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "portrait" | "square" | "video"
  withDescription?: boolean
}

export function SkeletonCard({
  aspectRatio = "portrait",
  withDescription = false,
  className,
  ...props
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-background transition-colors hover:border-primary",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "animate-pulse bg-muted",
          aspectRatio === "portrait" && "aspect-[3/4]",
          aspectRatio === "square" && "aspect-square",
          aspectRatio === "video" && "aspect-video",
        )}
      />
      <div className="p-4">
        <div className="mt-1 h-4 w-3/4 animate-pulse rounded-lg bg-muted" />
        {withDescription && (
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-3 w-5/6 animate-pulse rounded-lg bg-muted" />
          </div>
        )}
      </div>
    </div>
  )
}

