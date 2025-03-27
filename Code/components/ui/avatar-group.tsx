import type * as React from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  limit?: number
  avatars: Array<{
    name: string
    image?: string
  }>
}

export function AvatarGroup({ limit = 4, avatars, className, ...props }: AvatarGroupProps) {
  const showCount = avatars.length > limit
  const limitedAvatars = avatars.slice(0, limit)

  return (
    <div className={cn("flex items-center", className)} {...props}>
      {limitedAvatars.map((avatar, index) => (
        <Avatar key={index} className={cn("-ml-2.5 ring-2 ring-background", index === 0 && "ml-0")}>
          <AvatarImage src={avatar.image} alt={avatar.name} />
          <AvatarFallback>
            {avatar.name
              .split(" ")
              .map((chunk) => chunk[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      ))}

      {showCount && (
        <span className="-ml-2.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
          +{avatars.length - limit}
        </span>
      )}
    </div>
  )
}

