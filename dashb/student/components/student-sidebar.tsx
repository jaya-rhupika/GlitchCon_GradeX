"use client"

import { useRouter, usePathname } from "next/navigation"
import { Shield, Home, Calendar, BarChart2, BookOpen, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export default function StudentSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    router.push("/")
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">ExamSafe</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/dashboard/student")}
              isActive={isActive("/dashboard/student")}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/dashboard/student/exams")}
              isActive={isActive("/dashboard/student/exams")}
            >
              <Calendar className="h-4 w-4" />
              <span>Upcoming Exams</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/dashboard/student/results")}
              isActive={isActive("/dashboard/student/results")}
            >
              <BarChart2 className="h-4 w-4" />
              <span>Results</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/dashboard/student/materials")}
              isActive={isActive("/dashboard/student/materials")}
            >
              <BookOpen className="h-4 w-4" />
              <span>Study Materials</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/dashboard/student/profile")}
              isActive={isActive("/dashboard/student/profile")}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

