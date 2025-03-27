import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden bg-[url('/grid.svg')] bg-contain">
          <div className="relative min-h-screen w-full bg-background/95 backdrop-blur-sm">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}

