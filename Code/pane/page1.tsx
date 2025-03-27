"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, BookOpen, Calendar, Clock, FileText, Users } from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { NotificationBanner } from "@/components/ui/notification-banner"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AvatarGroup } from "@/components/ui/avatar-group"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const { toast } = useToast()
  const [showWelcome, setShowWelcome] = useState(true)
  const [loading, setLoading] = useState(true)

  // Mock data for dashboard statistics
  const stats = [
    { title: "Total Exams", value: 24, change: "+2", icon: FileText },
    { title: "Active Students", value: 573, change: "+18", icon: Users },
    { title: "Upcoming Exams", value: 7, nextText: "Advanced Algorithms (Tomorrow)", icon: Calendar },
    { title: "Average Score", value: "78.3%", change: "+2.1%", icon: Activity },
  ]

  // Mock calendar events
  const upcomingEvents = [
    {
      title: "Advanced Algorithms",
      type: "Exam",
      date: new Date(Date.now() + 86400000), // tomorrow
      status: "Scheduled",
      avatars: [
        { name: "John Doe", image: "/placeholder.svg?height=32&width=32" },
        { name: "Jane Smith", image: "/placeholder.svg?height=32&width=32" },
        { name: "Bob Johnson", image: "/placeholder.svg?height=32&width=32" },
        { name: "Alice Williams", image: "/placeholder.svg?height=32&width=32" },
        { name: "Charlie Brown", image: "/placeholder.svg?height=32&width=32" },
      ],
    },
    {
      title: "Machine Learning",
      type: "Question Submission",
      date: new Date(Date.now() + 86400000 * 4), // in 4 days
      status: "Pending",
      avatars: [
        { name: "John Doe", image: "/placeholder.svg?height=32&width=32" },
        { name: "Jane Smith", image: "/placeholder.svg?height=32&width=32" },
      ],
    },
    {
      title: "Software Engineering",
      type: "Exam",
      date: new Date(Date.now() + 86400000 * 7), // in 7 days
      status: "Scheduled",
      avatars: [
        { name: "Bob Johnson", image: "/placeholder.svg?height=32&width=32" },
        { name: "Alice Williams", image: "/placeholder.svg?height=32&width=32" },
        { name: "Charlie Brown", image: "/placeholder.svg?height=32&width=32" },
      ],
    },
  ]

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)

      // Show a welcome toast
      toast({
        title: "Welcome back!",
        description: "You have 3 upcoming exams this week.",
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, [toast])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <PageTransition>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {showWelcome && (
          <NotificationBanner
            title="Welcome to the new ExamSafe dashboard!"
            description="We've updated the interface to provide a better experience."
            variant="info"
            onOpenChange={setShowWelcome}
            className="mb-4"
          />
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-3xl font-bold tracking-tight mt-2">Dashboard</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="overview" className="relative overflow-hidden group">
              <span className="relative z-10">Overview</span>
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-primary/10 dark:bg-primary/20 -z-0"
                transition={{ type: "spring", duration: 0.5 }}
              />
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="relative overflow-hidden group">
              <span className="relative z-10">Upcoming Exams</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="relative overflow-hidden group">
              <span className="relative z-10">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {stats.map((stat, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <motion.div
                        whileHover={{
                          rotate: [0, -10, 10, -10, 0],
                          scale: 1.1,
                          transition: { duration: 0.5 },
                        }}
                      >
                        <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </motion.div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      {stat.change && <p className="text-xs text-muted-foreground">{stat.change} from last month</p>}
                      {stat.nextText && <p className="text-xs text-muted-foreground">Next: {stat.nextText}</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <motion.div
                className="col-span-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent exam and system activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          action: "Created new exam",
                          subject: "Data Structures Final",
                          time: "2 hours ago",
                        },
                        {
                          action: "Updated question bank",
                          subject: "Algorithms",
                          time: "Yesterday",
                        },
                        {
                          action: "Graded submissions",
                          subject: "Database Systems",
                          time: "2 days ago",
                        },
                        {
                          action: "Scheduled exam",
                          subject: "Computer Networks",
                          time: "3 days ago",
                        },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{item.action}</p>
                            <p className="text-sm text-muted-foreground">{item.subject}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">{item.time}</div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                className="col-span-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Schedule</CardTitle>
                    <CardDescription>Your upcoming exams and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {upcomingEvents.map((item, i) => (
                        <motion.div
                          key={i}
                          className="flex flex-col gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">{item.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.type} • {item.date.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-sm">
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                {item.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <AvatarGroup avatars={item.avatars} limit={3} />
                            <CountdownTimer targetDate={item.date} size="sm" showDays={false} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
                <CardDescription>View and manage your upcoming exams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      title: "Advanced Algorithms",
                      date: "Tomorrow, 10:00 AM - 12:00 PM",
                      students: 42,
                      status: "Ready",
                    },
                    {
                      title: "Software Engineering",
                      date: "Next Monday, 2:00 PM - 4:00 PM",
                      students: 38,
                      status: "Ready",
                    },
                    {
                      title: "Machine Learning",
                      date: "Next Wednesday, 9:00 AM - 11:00 AM",
                      students: 45,
                      status: "Draft",
                    },
                    {
                      title: "Computer Networks",
                      date: "Next Friday, 1:00 PM - 3:00 PM",
                      students: 36,
                      status: "Ready",
                    },
                  ].map((exam, i) => (
                    <motion.div
                      key={i}
                      className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.5 }}
                      whileHover={{
                        backgroundColor: "rgba(0,0,0,0.02)",
                        borderRadius: "0.5rem",
                        padding: "0.5rem",
                      }}
                    >
                      <div className="space-y-0.5">
                        <h3 className="font-medium">{exam.title}</h3>
                        <p className="text-sm text-muted-foreground">{exam.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">{exam.students} students</div>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            exam.status === "Ready"
                              ? "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {exam.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>View analytics and insights from your exams</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="h-[400px] flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">Analytics visualization would appear here</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing performance trends, difficulty analysis, and student progress
                    </p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}

