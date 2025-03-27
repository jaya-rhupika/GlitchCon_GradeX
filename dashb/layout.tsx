"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut, Settings, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import StudentSidebar from "./student/components/student-sidebar"
import FacultySidebar from "./faculty/components/faculty-sidebar"
import AdminSidebar from "./admin/components/admin-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const isMobile = useMobile()
  const [role, setRole] = useState<string | null>(null)
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  useEffect(() => {
    // In a real app, you would get this from your auth context or API
    // For demo purposes, we'll check localStorage
    const storedRole = localStorage.getItem("userRole")
    if (storedRole) {
      setRole(storedRole)

      // Redirect to the appropriate dashboard if on the main dashboard page
      if (pathname === "/dashboard") {
        router.push(`/dashboard/${storedRole}`)
      }
    } else {
      // Redirect to login if no role is found
      router.push("/")
    }
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/")
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        {/* Role-specific Sidebar */}
        {role === "student" && <StudentSidebar />}
        {role === "faculty" && <FacultySidebar />}
        {role === "admin" && <AdminSidebar />}

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Top Navigation */}
          <header className="sticky top-0 z-20 flex h-14 items-center border-b bg-background px-4">
            <SidebarTrigger />

            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                    {unreadNotifications}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full border">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

