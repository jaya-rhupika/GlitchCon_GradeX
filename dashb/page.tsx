"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Check the user's role and redirect to the appropriate dashboard
    const userRole = localStorage.getItem("userRole")

    if (userRole) {
      router.push(`/dashboard/${userRole}`)
    } else {
      // If no role is found, redirect to login
      router.push("/")
    }
  }, [router])

  // Show a loading state while redirecting
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  )
}

