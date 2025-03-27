"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Eye,
  FileEdit,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Play,
  AlertTriangle,
  Camera,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
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

// Sample questions for the test
const sampleQuestions = [
  {
    id: 1,
    question: "What is the time complexity of binary search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(log n)",
  },
  {
    id: 2,
    question: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: "Stack",
  },
  {
    id: 3,
    question: "What is the primary key in a database?",
    options: [
      "A key that is used for encryption",
      "A unique identifier for a record",
      "A foreign key",
      "A composite key",
    ],
    correctAnswer: "A unique identifier for a record",
  },
  {
    id: 4,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Quick Sort"],
    correctAnswer: "Quick Sort",
  },
  {
    id: 5,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Machine Learning",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language",
    ],
    correctAnswer: "Hyper Text Markup Language",
  },
]

export default function ExamsPage() {
  const [isTestActive, setIsTestActive] = useState(false)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [warningCount, setWarningCount] = useState(0)
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")
  const [showCameraPermission, setShowCameraPermission] = useState(false)
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [showExamStarted, setShowExamStarted] = useState(false)
  const [examToStart, setExamToStart] = useState<Exam | null>(null)

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const eyeTrackingContainerRef = useRef<HTMLDivElement>(null)

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
    if (isTestActive && cameraPermissionGranted) {
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
  }, [isTestActive, cameraPermissionGranted])

  // Timer effect
  useEffect(() => {
    if (isTestActive && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            handleSubmitExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (isPaused && timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isTestActive, isPaused, timeLeft])

  // Auto-submit if second violation
  useEffect(() => {
    if (warningCount >= 2) {
      handleSubmitExam()
      alert("Exam automatically submitted due to multiple violations of proctoring rules.")
    }
  }, [warningCount])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

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

  const handleInitiateTest = (exam: Exam) => {
    setExamToStart(exam)
    setShowCameraPermission(true)
  }

  const handleRequestCameraAccess = async () => {
    setIsLoading(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // Stop the stream immediately, EyeTracking component will request it again
      stream.getTracks().forEach((track) => track.stop())
      setCameraPermissionGranted(true)
      setIsLoading(false)

      // Show confirmation that exam is starting
      setShowExamStarted(true)
      setTimeout(() => {
        if (examToStart) {
          handleStartTest(examToStart)
        }
        setShowExamStarted(false)
      }, 3000)
    } catch (error) {
      console.error("Camera access denied:", error)
      setIsLoading(false)
      alert("Camera access is required for the proctored exam. Please allow camera access and try again.")
    }
  }

  const handleStartTest = (exam: Exam) => {
    setSelectedExam(exam)
    setTimeLeft(exam.duration * 60)
    setIsTestActive(true)
    setWarningCount(0)
    setCurrentQuestion(0)
    setAnswers({})
    setShowCameraPermission(false)
  }

  const handleSubmitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsTestActive(false)
    setWarningCount(0)
    setSelectedExam(null)
    setCameraPermissionGranted(false)
  }

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // Render the test interface
  if (isTestActive) {
    return (
      <div className="relative">
        {/* Eye tracking container with animation */}
        <div
          ref={eyeTrackingContainerRef}
          className="fixed top-4 right-4 z-50 w-64 h-48 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-110"
          style={{
            animation: "pulse 2s infinite",
            boxShadow: "0 0 15px rgba(0, 100, 255, 0.3)",
          }}
        >
          <div className="absolute top-0 left-0 w-full bg-primary/80 text-white text-xs py-1 px-2 flex items-center justify-between">
            <span className="flex items-center">
              <Camera className="h-3 w-3 mr-1" />
              Proctoring Active
            </span>
            <span className="animate-pulse text-red-200">● REC</span>
          </div>
          <EyeTracking />
        </div>

        {/* Test content */}
        <div
          className={`container mx-auto p-4 transition-opacity duration-300 ${isPaused ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          <div className="flex justify-between items-center mb-6 bg-card p-4 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold">{selectedExam?.title || "Exam"}</h1>
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 text-lg font-mono px-3 py-1 rounded-full ${
                  timeLeft < 300
                    ? "text-red-500 bg-red-50 dark:bg-red-950/30 animate-pulse"
                    : "text-primary bg-primary/10"
                }`}
              >
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </div>
              <Button
                onClick={handleSubmitExam}
                variant="destructive"
                className="transition-all duration-300 hover:scale-105"
              >
                Submit Exam
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Card className="mb-6 shadow-md transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      Question {currentQuestion + 1} of {sampleQuestions.length}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {answers[sampleQuestions[currentQuestion].id] ? "Answered" : "Not answered"}
                    </span>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg mb-6">
                    <p className="text-lg">{sampleQuestions[currentQuestion].question}</p>
                  </div>

                  <div className="space-y-3">
                    {sampleQuestions[currentQuestion].options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          answers[sampleQuestions[currentQuestion].id] === option
                            ? "bg-primary/10 border-primary transform scale-[1.02] shadow-sm"
                            : "hover:bg-muted hover:scale-[1.01]"
                        }`}
                        onClick={() => handleAnswerSelect(sampleQuestions[currentQuestion].id, option)}
                      >
                        <label className="flex items-center cursor-pointer w-full">
                          <input
                            type="radio"
                            className="mr-3"
                            checked={answers[sampleQuestions[currentQuestion].id] === option}
                            onChange={() => {}}
                          />
                          <span className="flex-1">{option}</span>
                          {answers[sampleQuestions[currentQuestion].id] === option && (
                            <CheckCircle2 className="h-5 w-5 text-primary ml-2 animate-in fade-in" />
                          )}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      onClick={handlePrevQuestion}
                      disabled={currentQuestion === 0}
                      variant="outline"
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleNextQuestion}
                      disabled={currentQuestion === sampleQuestions.length - 1}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card className="sticky top-4 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Question Navigator</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-5 gap-2">
                    {sampleQuestions.map((q, index) => (
                      <Button
                        key={q.id}
                        variant={currentQuestion === index ? "default" : answers[q.id] ? "outline" : "ghost"}
                        className={`h-10 w-10 p-0 transition-all duration-200 ${
                          currentQuestion === index ? "ring-2 ring-primary ring-offset-2" : ""
                        } ${answers[q.id] ? "border-primary" : ""}`}
                        onClick={() => setCurrentQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span>Current Question</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-primary rounded-full"></div>
                      <span>Answered</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="w-full">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>
                        {Object.keys(answers).length}/{sampleQuestions.length} answered
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(Object.keys(answers).length / sampleQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        {/* Warning Dialog */}
        <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
          <DialogContent className="sm:max-w-md animate-in zoom-in-95 duration-300">
            <DialogHeader>
              <DialogTitle className="flex items-center text-destructive">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Proctoring Violation Detected
              </DialogTitle>
              <DialogDescription>{warningMessage}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm font-medium text-destructive">
                  {warningCount === 1
                    ? "This is your first warning. If another violation is detected, your exam will be automatically submitted."
                    : "This is your final warning. Another violation will result in automatic submission of your exam."}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleContinueExam} className="w-full sm:w-auto">
                I Understand, Continue Exam
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Exams</h2>
          <Button asChild className="transition-all duration-200 hover:scale-105">
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

        <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
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
                  <TableRow key={exam.id} className="transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>{exam.date}</TableCell>
                    <TableCell>{exam.time}</TableCell>
                    <TableCell>{exam.questions}</TableCell>
                    <TableCell>{exam.duration} min</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 transition-colors hover:bg-primary/10"
                            onClick={() => handleInitiateTest(exam)}
                          >
                            <Play className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Start Test</span>
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="animate-in zoom-in-95 duration-100">
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

      {/* Camera Permission Dialog */}
      <Dialog open={showCameraPermission} onOpenChange={setShowCameraPermission}>
        <DialogContent className="sm:max-w-md animate-in zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2 text-primary" />
              Proctored Exam - Camera Required
            </DialogTitle>
            <DialogDescription>
              This is a proctored exam that requires camera access to monitor for academic integrity. Your camera feed
              will be analyzed for suspicious activities.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-medium text-sm mb-2">Proctoring will detect:</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                  <span>Multiple faces in the camera view</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                  <span>Looking away from the screen</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                  <span>Absence from the camera view</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Two violations will result in automatic submission of your exam. Please ensure you're in a quiet
                environment with good lighting.
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowCameraPermission(false)} className="sm:w-auto w-full">
              Cancel
            </Button>
            <Button onClick={handleRequestCameraAccess} disabled={isLoading} className="sm:w-auto w-full gap-2">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Requesting Access...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  Allow Camera & Start Exam
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exam Started Confirmation */}
      <Dialog open={showExamStarted} onOpenChange={setShowExamStarted}>
        <DialogContent className="sm:max-w-md animate-in zoom-in-95 duration-300">
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Camera Access Granted</h2>
            <p className="text-center text-muted-foreground mb-4">Your exam will start in a moment. Good luck!</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-[loading_3s_ease-in-out]"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 5px rgba(0, 100, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(0, 100, 255, 0.5);
          }
          100% {
            box-shadow: 0 0 5px rgba(0, 100, 255, 0.3);
          }
        }
        
        @keyframes loading {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </>
  )
}

