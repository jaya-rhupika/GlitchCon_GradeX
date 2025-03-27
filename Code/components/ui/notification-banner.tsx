"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"
import { type ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NotificationBannerProps = {
  title: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "info"
  showCloseButton?: boolean
  icon?: ReactNode
  action?: ReactNode
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function NotificationBanner({
  title,
  description,
  variant = "default",
  showCloseButton = true,
  icon,
  action,
  className,
  open: controlledOpen,
  onOpenChange,
}: NotificationBannerProps) {
  const [internalOpen, setInternalOpen] = useState(true)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false)
    } else {
      setInternalOpen(false)
    }
  }

  const getIcon = () => {
    if (icon) return icon

    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-foreground" />
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "w-full px-4 py-3 rounded-lg flex items-center gap-3",
            variant === "success" && "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300",
            variant === "error" && "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300",
            variant === "warning" && "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300",
            variant === "info" && "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
            variant === "default" && "bg-muted",
            className,
          )}
        >
          {getIcon()}
          <div className="flex-1">
            <h5 className="font-medium">{title}</h5>
            {description && <p className="text-sm opacity-90">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            {action}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-7 w-7 shrink-0 hover:bg-background/10"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

