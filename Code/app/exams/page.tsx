"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Eye, FileEdit, Filter, MoreHorizontal, Plus, Search, Trash2, Play, AlertTriangle } from "lucide-react"
import TestPage from "./test-page"
import EyeTracking from "../../EyeTracking"

// Define a type for the Exam to improve type safety
type Exam = {
  id: string
  title: string
  subject: string
  date: string
  time: string
  status: "Scheduled" | "Completed" | "Draft"
  questions: number
  duration: number
}

// Define props for TestPage component to fix TypeScript error
interface TestPageProps {
  onSubmit: () => void
  isPaused: boolean
  exam: Exam | null
}

export default function ExamsPage() {
  const [isTestActive, setIsTestActive] = useState(false)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [warningCount, setWarningCount] = useState(0)
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")

  // Mock data for exams
  const exams: Exam[] = [
    {
      id: "1",
      title: "Data Structures Final",
      subject: "Computer Science",
      date: "2023-12-15",
      time: "10:00 AM - 12:00 PM",
      status: "Scheduled",
      questions: 45,
      duration: 120,
    },
    {
      id: "2",
      title: "Database Systems Midterm",
      subject: "Computer Science",
      date: "2023-11-10",
      time: "2:00 PM - 4:00 PM",
      status: "Completed",
      questions: 30,
      duration: 90,
    },
    {
      id: "3",
      title: "Advanced Algorithms Quiz",
      subject: "Computer Science",
      date: "2023-12-05",
      time: "9:00 AM - 10:00 AM",
      status: "Draft",
      questions: 20,
      duration: 60,
    },
    {
      id: "4",
      title: "Machine Learning Project Defense",
      subject: "Computer Science",
      date: "2023-12-20",
      time: "1:00 PM - 5:00 PM",
      status: "Scheduled",
      questions: 10,
      duration: 240,
    },
    {
      id: "5",
      title: "Computer Networks Final",
      subject: "Computer Science",
      date: "2023-12-18",
      time: "10:00 AM - 12:00 PM",
      status: "Scheduled",
      questions: 40,
      duration: 120,
    },
  ]

  // Monitor the EyeTracking component's alert messages
  useEffect(() => {
    if (isTestActive) {
      // Check for alert messages from EyeTracking component
      const checkAlertInterval = setInterval(() => {
        // Get the alert message element from the EyeTracking component
        const alertElement = document.querySelector('[style*="color: red"]')
        if (alertElement && alertElement.textContent) {
          const currentAlert = alertElement.textContent

          if (currentAlert !== "") {
            handleViolation(currentAlert)
          }
        }
      }, 1000)

      return () => clearInterval(checkAlertInterval)
    }
  }, [isTestActive])

  const handleViolation = (message: string) => {
    setWarningMessage(message)
    setIsPaused(true)
    setShowWarningDialog(true)
    setWarningCount((prev) => prev + 1)
  }

  const handleContinueExam = () => {
    setIsPaused(false)
    setShowWarningDialog(false)
  }

  const handleStartTest = (exam: Exam) => {
    setSelectedExam(exam)
    setIsTestActive(true)
    setWarningCount(0)
  }

  const handleSubmitExam = () => {
    setIsTestActive(false)
    setWarningCount(0)
    setSelectedExam(null)
  }

  // Auto-submit if second violation
  useEffect(() => {
    if (warningCount >= 2) {
      handleSubmitExam()
      alert("Exam automatically submitted due to multiple violations of proctoring rules.")
    }
  }, [warningCount])

  if (isTestActive) {
    return (
      <div className="relative">
        <div className="fixed top-4 right-4 z-50 w-64 h-48 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
          <EyeTracking />
        </div>
        <TestPage onSubmit={handleSubmitExam} isPaused={isPaused} exam={selectedExam} />

        {/* Warning Dialog */}
        <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-destructive">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Proctoring Violation Detected
              </DialogTitle>
              <DialogDescription>{warningMessage}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                {warningCount === 1
                  ? "This is your first warning. If another violation is detected, your exam will be automatically submitted."
                  : "This is your final warning. Another violation will result in automatic submission of your exam."}
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleContinueExam}>I Understand, Continue Exam</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Exams</h2>
        <Button asChild>
          <Link href="/exams/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center space-x-2 md:w-2/3">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search exams..." className="w-full pl-8" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Exams</CardTitle>
          <CardDescription>Create, edit, and manage your exams</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>{exam.date}</TableCell>
                  <TableCell>{exam.time}</TableCell>
                  <TableCell>{exam.questions}</TableCell>
                  <TableCell>{exam.duration} min</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        exam.status === "Scheduled"
                          ? "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : exam.status === "Completed"
                            ? "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {exam.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {exam.status === "Scheduled" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                              <Play className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Start Test</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Start {exam.title}</DialogTitle>
                              <DialogDescription>
                                You are about to start the exam. Once started, the timer will begin and you must
                                complete the exam.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Exam Details:</p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>Duration: {exam.duration} minutes</li>
                                  <li>Questions: {exam.questions}</li>
                                  <li>Date: {exam.date}</li>
                                  <li>Time: {exam.time}</li>
                                </ul>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Instructions:</p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>Ensure you have a stable internet connection</li>
                                  <li>Do not refresh or close the browser during the exam</li>
                                  <li>Submit your answers before the timer ends</li>
                                  <li>Proctoring system will monitor for cheating attempts</li>
                                  <li>Two violations will result in automatic submission</li>
                                </ul>
                              </div>
                            </div>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline">Cancel</Button>
                              <Button onClick={() => handleStartTest(exam)}>Start Exam</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/exams/${exam.id}`} className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/exams/${exam.id}/edit`} className="flex items-center">
                              <FileEdit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive flex items-center">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

