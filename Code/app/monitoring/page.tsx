"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, AlertTriangle, Clock, Eye, MonitorSmartphone, Shield, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/page-transition"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { NotificationBanner } from "@/components/ui/notification-banner"
import { useToast } from "@/hooks/use-toast"

export default function MonitoringPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [showLiveAlert, setShowLiveAlert] = useState(false)
  const [liveAlertData, setLiveAlertData] = useState<{
    studentName: string
    examTitle: string
    type: string
    severity: string
  } | null>(null)

  // Mock data for active exams
  const activeExams = [
    {
      id: "1",
      title: "Data Structures Final",
      startTime: "10:00 AM",
      duration: "120 min",
      activeStudents: 42,
      totalStudents: 45,
      alerts: 3,
    },
    {
      id: "2",
      title: "Advanced Algorithms Quiz",
      startTime: "9:00 AM",
      duration: "60 min",
      activeStudents: 38,
      totalStudents: 40,
      alerts: 1,
    },
  ]

  // Mock data for active students
  const activeStudents = [
    {
      id: "1",
      name: "Alice Johnson",
      examTitle: "Data Structures Final",
      progress: "32/45",
      timeRemaining: "45 min",
      status: "Active",
      alerts: 0,
    },
    {
      id: "2",
      name: "Bob Smith",
      examTitle: "Data Structures Final",
      progress: "28/45",
      timeRemaining: "52 min",
      status: "Active",
      alerts: 1,
    },
    {
      id: "3",
      name: "Charlie Brown",
      examTitle: "Data Structures Final",
      progress: "40/45",
      timeRemaining: "38 min",
      status: "Active",
      alerts: 0,
    },
    {
      id: "4",
      name: "Diana Prince",
      examTitle: "Advanced Algorithms Quiz",
      progress: "15/20",
      timeRemaining: "22 min",
      status: "Warning",
      alerts: 2,
    },
    {
      id: "5",
      name: "Ethan Hunt",
      examTitle: "Advanced Algorithms Quiz",
      progress: "18/20",
      timeRemaining: "18 min",
      status: "Active",
      alerts: 0,
    },
  ]

  // Mock data for alerts
  const alerts = [
    {
      id: "1",
      studentName: "Diana Prince",
      examTitle: "Advanced Algorithms Quiz",
      type: "Multiple faces detected",
      time: "2 minutes ago",
      severity: "High",
    },
    {
      id: "2",
      studentName: "Bob Smith",
      examTitle: "Data Structures Final",
      type: "Tab switching detected",
      time: "5 minutes ago",
      severity: "Medium",
    },
    {
      id: "3",
      studentName: "Diana Prince",
      examTitle: "Advanced Algorithms Quiz",
      type: "Suspicious eye movements",
      time: "8 minutes ago",
      severity: "Medium",
    },
    {
      id: "4",
      studentName: "Frank Castle",
      examTitle: "Data Structures Final",
      type: "Fullscreen mode exited",
      time: "15 minutes ago",
      severity: "Low",
    },
  ]

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Simulate receiving a live alert
  useEffect(() => {
    if (loading) return

    const timer = setTimeout(() => {
      const newAlert = {
        studentName: "Alice Johnson",
        examTitle: "Data Structures Final",
        type: "Tab switching detected",
        severity: "Medium",
      }

      setLiveAlertData(newAlert)
      setShowLiveAlert(true)

      toast({
        title: "New Alert Detected",
        description: `${newAlert.studentName} - ${newAlert.type}`,
        variant: "destructive",
      })
    }, 5000)

    return () => clearTimeout(timer)
  }, [loading, toast])

  const onAction = () => {
    toast({
      title: "Alert Reviewed",
      description: "The alert has been marked as reviewed",
    })
    setShowLiveAlert(false)
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted"></div>
          <div className="h-5 w-36 animate-pulse rounded-lg bg-muted"></div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard withDescription />
          <SkeletonCard withDescription />
          <SkeletonCard withDescription />
          <SkeletonCard withDescription />
        </div>

        <div className="mt-6">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-muted"></div>
          <div className="mt-4">
            <SkeletonCard aspectRatio="video" withDescription />
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AnimatePresence>
          {showLiveAlert && liveAlertData && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="w-full"
            >
              <NotificationBanner
                title="Live Alert: Action Required"
                description={`${liveAlertData.studentName} (${liveAlertData.examTitle}): ${liveAlertData.type}`}
                variant="error"
                onOpenChange={setShowLiveAlert}
                action={
                  <Button size="sm" onClick={onAction}>
                    Review
                  </Button>
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Monitoring</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-3xl font-bold tracking-tight mt-2">Live Monitoring</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
            <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 300, damping: 24 },
              },
            }}
          >
            <Card className="border-l-4 border-l-blue-500 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
                <motion.div
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1,
                    transition: { duration: 0.5 },
                  }}
                >
                  <MonitorSmartphone className="h-4 w-4 text-blue-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeExams.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeExams.reduce((acc, exam) => acc + exam.activeStudents, 0)} students taking exams
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 300, damping: 24 },
              },
            }}
          >
            <Card className="border-l-4 border-l-green-500 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                <motion.div
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1,
                    transition: { duration: 0.5 },
                  }}
                >
                  <User className="h-4 w-4 text-green-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeStudents.filter((s) => s.status === "Active").length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeStudents.filter((s) => s.status !== "Active").length} students with warnings
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 300, damping: 24 },
              },
            }}
          >
            <Card className="border-l-4 border-l-red-500 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <motion.div
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1,
                    transition: { duration: 0.5 },
                  }}
                  className="relative"
                >
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"
                  ></motion.span>
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alerts.length}</div>
                <p className="text-xs text-muted-foreground">
                  {alerts.filter((a) => a.severity === "High").length} high priority alerts
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 300, damping: 24 },
              },
            }}
          >
            <Card className="border-l-4 border-l-green-500 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <motion.div
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1,
                    transition: { duration: 0.5 },
                  }}
                >
                  <Shield className="h-4 w-4 text-green-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Operational</div>
                <p className="text-xs text-muted-foreground">All systems running normally</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <Tabs defaultValue="exams" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="exams" className="relative overflow-hidden group">
              <span className="relative z-10">Active Exams</span>
              <motion.div
                layoutId="tab-indicator-monitoring"
                className="absolute inset-0 bg-primary/10 dark:bg-primary/20 -z-0"
                transition={{ type: "spring", duration: 0.5 }}
              />
            </TabsTrigger>
            <TabsTrigger value="students" className="relative overflow-hidden group">
              <span className="relative z-10">Active Students</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="relative overflow-hidden group">
              <span className="relative z-10">Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Exams</CardTitle>
                <CardDescription>Currently running exams with real-time statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Title</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Active Students</TableHead>
                      <TableHead>Alerts</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeExams.map((exam, index) => (
                      <motion.tr
                        key={exam.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        className="group"
                      >
                        <TableCell className="font-medium">{exam.title}</TableCell>
                        <TableCell>{exam.startTime}</TableCell>
                        <TableCell>{exam.duration}</TableCell>
                        <TableCell>
                          <motion.div
                            className="relative inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md dark:bg-blue-900/30 dark:text-blue-400"
                            whileHover={{ scale: 1.1 }}
                          >
                            {exam.activeStudents}/{exam.totalStudents}
                          </motion.div>
                        </TableCell>
                        <TableCell>
                          {exam.alerts > 0 ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: [0, 1.2, 1] }}
                              transition={{ delay: 0.3 + 0.1 * index, type: "spring" }}
                            >
                              <Badge variant="destructive" className="animate-pulse">
                                {exam.alerts}
                              </Badge>
                            </motion.div>
                          ) : (
                            <Badge variant="outline">0</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Monitor
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Students</CardTitle>
                <CardDescription>Students currently taking exams with real-time monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Time Remaining</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Alerts</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeStudents.map((student, index) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        className="group relative"
                      >
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.examTitle}</TableCell>
                        <TableCell>
                          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              className="bg-primary h-2.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(Number.parseInt(student.progress.split("/")[0]) / Number.parseInt(student.progress.split("/")[1])) * 100}%`,
                              }}
                              transition={{ delay: 0.3 + 0.1 * index, duration: 0.5 }}
                            />
                          </div>
                          <div className="text-xs mt-1 text-muted-foreground">{student.progress}</div>
                        </TableCell>
                        <TableCell>{student.timeRemaining}</TableCell>
                        <TableCell>
                          <Badge
                            variant={student.status === "Active" ? "outline" : "destructive"}
                            className={
                              student.status === "Active"
                                ? "border-green-500 bg-green-100 text-green-800 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300"
                                : ""
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {student.alerts > 0 ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: [0, 1.2, 1] }}
                              transition={{ delay: 0.3 + 0.1 * index, type: "spring" }}
                            >
                              <Badge variant="destructive" className="animate-pulse">
                                {student.alerts}
                              </Badge>
                            </motion.div>
                          ) : (
                            <Badge variant="outline">0</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                        {student.status === "Warning" && (
                          <motion.div
                            className="absolute inset-0 rounded-md border-2 border-red-500 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 2,
                              delay: 0.5 + 0.1 * index,
                            }}
                          />
                        )}
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
                <CardDescription>Suspicious activities and potential violations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Alert Type</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert, index) => (
                      <motion.tr
                        key={alert.id}
                        initial={{ opacity: 0, y: 10, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                        animate={{ opacity: 1, y: 0, backgroundColor: "rgba(239, 68, 68, 0)" }}
                        transition={{
                          delay: 0.1 * index,
                          duration: 0.3,
                          backgroundColor: { delay: 0.3 + 0.1 * index, duration: 1 },
                        }}
                        className="group"
                      >
                        <TableCell className="font-medium">{alert.studentName}</TableCell>
                        <TableCell>{alert.examTitle}</TableCell>
                        <TableCell>{alert.type}</TableCell>
                        <TableCell>{alert.time}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              alert.severity === "High"
                                ? "destructive"
                                : alert.severity === "Medium"
                                  ? "default"
                                  : "outline"
                            }
                            className={alert.severity === "High" ? "animate-pulse" : ""}
                          >
                            {alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          >
                            <Activity className="mr-2 h-4 w-4" />
                            Review
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}

