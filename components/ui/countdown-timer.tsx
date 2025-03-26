"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type CountdownTimerProps = {
  targetDate: Date | number
  className?: string
  onComplete?: () => void
  showDays?: boolean
  size?: "sm" | "md" | "lg"
}

export function CountdownTimer({
  targetDate,
  className,
  onComplete,
  showDays = true,
  size = "md",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const target = typeof targetDate === "number" ? new Date(Date.now() + targetDate) : targetDate

    const calculateTimeLeft = () => {
      const difference = +target - +new Date()

      if (difference <= 0) {
        setIsComplete(true)
        if (onComplete) onComplete()
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft()
      setTimeLeft(timeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  const formatNumber = (value: number) => {
    return value.toString().padStart(2, "0")
  }

  const sizeClasses = {
    sm: "text-lg font-medium px-2 py-1",
    md: "text-2xl font-bold px-3 py-2",
    lg: "text-3xl font-bold px-4 py-2",
  }

  return (
    <div className={cn("flex items-center gap-2 text-center", !showDays && "justif-center", className)}>
      {showDays && (
        <>
          <div className="flex flex-col">
            <div className={cn("rounded bg-primary text-primary-foreground", sizeClasses[size])}>
              {formatNumber(timeLeft.days)}
            </div>
            <span className="text-xs text-muted-foreground">Days</span>
          </div>
          <span className="text-foreground font-bold">:</span>
        </>
      )}
      <div className="flex flex-col">
        <div className={cn("rounded bg-primary text-primary-foreground", sizeClasses[size])}>
          {formatNumber(timeLeft.hours)}
        </div>
        <span className="text-xs text-muted-foreground">Hours</span>
      </div>
      <span className="text-foreground font-bold">:</span>
      <div className="flex flex-col">
        <div className={cn("rounded bg-primary text-primary-foreground", sizeClasses[size])}>
          {formatNumber(timeLeft.minutes)}
        </div>
        <span className="text-xs text-muted-foreground">Min</span>
      </div>
      <span className="text-foreground font-bold">:</span>
      <div className="flex flex-col">
        <div className={cn("rounded bg-primary text-primary-foreground", sizeClasses[size])}>
          {formatNumber(timeLeft.seconds)}
        </div>
        <span className="text-xs text-muted-foreground">Sec</span>
      </div>
    </div>
  )
}

