"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Test {
  id: string
  subject: string
  classId: string
  scheduledDate: string
}

interface ClassRequest {
  studentRegNo: string
  studentName: string
  classId: string
}

interface TeacherClass {
  classId: string
  className: string
}

export default function FacultyDashboard() {
  const router = useRouter()
  const [tests, setTests] = useState<Test[]>([])
  const [classRequests, setClassRequests] = useState<ClassRequest[]>([])
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch test data (replace this with API call if needed)
    const dummyTests = [
      { id: "1", subject: "Mathematics Final", classId: "A1", scheduledDate: "2025-04-01" },
      { id: "2", subject: "Computer Science Midterm", classId: "B2", scheduledDate: "2025-04-05" },
    ]
    setTests(dummyTests)

    // Fetch class requests (replace with API call)
    const dummyRequests = [
      { studentRegNo: "2025001", studentName: "Alice", classId: "A1" },
      { studentRegNo: "2025002", studentName: "Bob", classId: "B2" },
    ]
    setClassRequests(dummyRequests)

    // Fetch teacher's classes (replace with API call)
    const dummyClasses = [
      { classId: "A1", className: "Math Class" },
      { classId: "B2", className: "Science Class" },
    ]
    setTeacherClasses(dummyClasses)

    // Simulate loading data
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const handleApprove = (regNo: string) => {
    console.log(`Approved student: ${regNo}`)
    setClassRequests(classRequests.filter((req) => req.studentRegNo !== regNo))
  }

  const handleReject = (regNo: string) => {
    console.log(`Rejected student: ${regNo}`)
    setClassRequests(classRequests.filter((req) => req.studentRegNo !== regNo))
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your classes and exams.</p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">Across 5 classes</p>
            <Progress value={85} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.length}</div>
            <p className="text-xs text-muted-foreground">Next exam in 9 days</p>
            <Progress value={60} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Question Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+28 this month</p>
            <Progress value={75} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last semester</p>
            <Progress value={87} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Tests</CardTitle>
            <CardDescription>Manage your upcoming examinations</CardDescription>
          </CardHeader>
          <CardContent>
            {tests.length === 0 ? (
              <p>No scheduled tests.</p>
            ) : (
              <div className="space-y-4">
                {tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-medium">{test.subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        Class: {test.classId} • {new Date(test.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Start Test
                      </Button>
                      <Button size="sm">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Join Requests</CardTitle>
            <CardDescription>Students waiting to join your classes</CardDescription>
          </CardHeader>
          <CardContent>
            {classRequests.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              <div className="space-y-4">
                {classRequests.map((req) => (
                  <div key={req.studentRegNo} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-medium">{req.studentName}</h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {req.studentRegNo} • Class: {req.classId}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleReject(req.studentRegNo)}>
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(req.studentRegNo)}>
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for faculty members.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Button
                className="h-auto flex-col items-center justify-center gap-2 p-4"
                onClick={() => router.push("/dashboard/faculty/question-bank")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="M8 18v-1" />
                  <path d="M16 18v-3" />
                </svg>
                <span className="mt-1 text-xs">Create Exam</span>
              </Button>
              <Button className="h-auto flex-col items-center justify-center gap-2 p-4" variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="mt-1 text-xs">Manage Classes</span>
              </Button>
              <Button className="h-auto flex-col items-center justify-center gap-2 p-4" variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="mt-1 text-xs">Announcements</span>
              </Button>
              <Button className="h-auto flex-col items-center justify-center gap-2 p-4" variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
                <span className="mt-1 text-xs">Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

