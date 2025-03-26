"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
  UserCircle,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  // Mock user data - in a real app, this would come from your auth system
  const user = {
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "faculty", // Options: admin, faculty, student
    avatar: "/placeholder.svg?height=32&width=32",
  }

  // Navigation items based on user role
  const getNavItems = (role: string) => {
    const commonItems = [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        title: "Calendar",
        icon: Calendar,
        href: "/calendar",
      },
    ]

    const adminItems = [
      {
        title: "User Management",
        icon: Users,
        href: "/users",
      },
      {
        title: "Monitoring",
        icon: Shield,
        href: "/monitoring",
      },
      {
        title: "Analytics",
        icon: ChevronDown,
        href: "/analytics",
      },
    ]

    const facultyItems = [
      {
        title: "Exams",
        icon: FileText,
        href: "/exams",
      },
      {
        title: "Question Banks",
        icon: BookOpen,
        href: "/question-banks",
      },
      {
        title: "Results",
        icon: ClipboardList,
        href: "/results",
      },
    ]

    const studentItems = [
      {
        title: "My Exams",
        icon: FileText,
        href: "/my-exams",
      },
      {
        title: "My Results",
        icon: ClipboardList,
        href: "/my-results",
      },
    ]

    switch (role) {
      case "admin":
        return [...commonItems, ...adminItems]
      case "faculty":
        return [...commonItems, ...facultyItems]
      case "student":
        return [...commonItems, ...studentItems]
      default:
        return commonItems
    }
  }

  const navItems = getNavItems(user.role)

  const sidebarItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        ease: "easeOut",
      },
    }),
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <motion.div
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="h-6 w-6 text-primary" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="font-semibold text-lg"
          >
            ExamSafe
          </motion.div>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item, i) => (
                <SidebarMenuItem key={item.title}>
                  <motion.div
                    custom={i}
                    variants={sidebarItemVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full"
                  >
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <Link href={item.href} className="relative">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {pathname === item.href && (
                          <motion.div
                            layoutId="active-nav-item"
                            className="absolute inset-0 rounded-md bg-primary/10 dark:bg-primary/20 -z-10"
                            transition={{ type: "spring", duration: 0.3 }}
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <motion.div
                  variants={sidebarItemVariants}
                  custom={navItems.length + 1}
                  initial="hidden"
                  animate="visible"
                  className="w-full"
                >
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link href="/settings">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-9 w-full justify-start px-2 transition-all duration-300",
                  state === "collapsed" && "justify-center px-0",
                )}
              >
                <Avatar
                  className={cn(
                    "h-6 w-6 mr-2 ring-2 ring-primary/20 transition-all duration-300",
                    state === "collapsed" && "mr-0",
                  )}
                >
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <AnimatePresence>
                  {state !== "collapsed" && (
                    <motion.div
                      className="flex flex-col items-start text-xs"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="font-medium">{user.name}</span>
                      <span className="text-muted-foreground capitalize">{user.role}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/logout" className="flex items-center text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

