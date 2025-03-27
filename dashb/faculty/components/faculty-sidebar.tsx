"use client"

import { useRouter, usePathname } from "next/navigation"
import { Shield, Home, Database, BarChart2, Users, User, LogOut } from "lucide-react"
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

export default function FacultySidebar() {
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
              onClick={() => router.push("/dashboard/faculty")}
              isActive={isActive("/dashboard/faculty")}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/dashboard/faculty/question-bank")}
              isActive={isActive("/dashboard/faculty/question-bank")}
            >
              <Database className="h-4 w-4" />
              <span>Question Bank</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/dashboard/faculty/student-results")}
              isActive={isActive("/dashboard/faculty/student-results")}
            >
              <BarChart2 className="h-4 w-4" />
              <span>Student Results</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/dashboard/faculty/classes")}
              isActive={isActive("/dashboard/faculty/classes")}
            >
              <Users className="h-4 w-4" />
              <span>Classes</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/dashboard/faculty/profile")}
              isActive={isActive("/dashboard/faculty/profile")}
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

