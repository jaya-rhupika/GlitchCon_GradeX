"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { NotificationBanner } from "@/components/ui/notification-banner"
import { useToast } from "@/hooks/use-toast"

export default function ExamPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [remainingTimeMs, setRemainingTimeMs] = useState(6300000) // 1h 45m in ms
  const [isFullscreen, setIsFullscreen] = useState(true)
  const [showTabWarning, setShowTabWarning] = useState(false)
  const [examStarted, setExamStarted] = useState(false)
  const [showStartDialog, setShowStartDialog] = useState(true)
  const [loadingQuestions, setLoadingQuestions] = useState(true)

  // Mock exam data
  const exam = {
    id: params.id,
    title: "Data Structures Final",
    subject: "Computer Science",
    totalQuestions: 45,
    duration: "2 hours",
    instructions: "Answer all questions. Each question carries equal marks. No negative marking.",
    questions: Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      text: `This is question ${i + 1} about data structures. What is the time complexity of searching in a balanced binary search tree?`,
      options: [
        { id: "a", text: "O(1)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n)" },
        { id: "d", text: "O(n log n)" },
      ],
    })),
  }

  useEffect(() => {
    if (examStarted) {
      const timer = setTimeout(() => setLoadingQuestions(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [examStarted])

  // Simulate tab switching detection
  useEffect(() => {
    if (!examStarted) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setShowTabWarning(true)

        toast({
          title: "Warning!",
          description: "Tab switching detected! This may be flagged as suspicious activity.",
          variant: "destructive",
        })
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [examStarted, toast])

  const handleNextQuestion = () => {
    if (currentQuestion < exam.totalQuestions - 1) {
      const nextAnimation = {
        x: [-20, 0],
        opacity: [0, 1],
      }

      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: value,
    })

    // Show a subtle toast confirmation
    toast({
      title: "Answer saved",
      description: `Question ${currentQuestion + 1} answer recorded`,
    })
  }

  const startExam = () => {
    setExamStarted(true)
    setShowStartDialog(false)

    toast({
      title: "Exam started!",
      description: "Good luck on your exam. Your time has begun.",
    })
  }

  const progress = Math.round((Object.keys(selectedAnswers).length / exam.totalQuestions) * 100)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with exam info and timer */}
      <header className="sticky top-0 z-10 border-b bg-background p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{exam.title}</h1>
            <p className="text-sm text-muted-foreground">{exam.subject}</p>
          </div>
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CountdownTimer
                targetDate={remainingTimeMs}
                showDays={false}
                onComplete={() => {
                  toast({
                    title: "Time's up!",
                    description: "Your exam is being submitted automatically.",
                    variant: "destructive",
                  })
                }}
              />
            </motion.div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isFullscreen ? (
                  <motion.div
                    key="eyeoff"
                    initial={{ rotate: -30, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 30, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EyeOff className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="eye"
                    initial={{ rotate: -30, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 30, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Eye className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="sr-only">Toggle fullscreen</span>
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>
              {Object.keys(selectedAnswers).length} of {exam.totalQuestions} answered
            </span>
          </div>
          <Progress value={progress} className="mt-2 h-2" />
        </div>
      </header>

      {/* Tab warning notification */}
      <AnimatePresence>
        {showTabWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full"
          >
            <NotificationBanner
              title="Tab switching detected!"
              description="This activity has been logged. Multiple violations may result in automatic submission."
              variant="error"
              onOpenChange={setShowTabWarning}
              className="rounded-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8">
        {loadingQuestions && examStarted ? (
          <div className="flex h-[70vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-lg font-medium">Loading exam questions...</p>
              <p className="text-sm text-muted-foreground">Please wait while we prepare your exam</p>
            </div>
          </div>
        ) : examStarted ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="mx-auto max-w-3xl overflow-hidden">
              <CardHeader>
                <CardTitle>
                  Question {currentQuestion + 1} of {exam.totalQuestions}
                </CardTitle>
                <CardDescription>Select the best answer for the question below</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-lg font-medium">{exam.questions[currentQuestion].text}</div>

                  <RadioGroup
                    value={selectedAnswers[currentQuestion] || ""}
                    onValueChange={handleAnswerSelect}
                    className="space-y-3"
                  >
                    {exam.questions[currentQuestion].options.map((option) => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-2 rounded-md border p-4 transition-colors ${
                          selectedAnswers[currentQuestion] === option.id ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                        <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer text-base">
                          {option.text}
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </motion.div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="relative overflow-hidden group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Previous
                </Button>
                <Button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === exam.totalQuestions - 1}
                  className="relative overflow-hidden group"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>

            {/* Question navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto mt-8 max-w-3xl"
            >
              <h3 className="mb-4 font-medium">Question Navigation</h3>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {Array.from({ length: exam.totalQuestions }, (_, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant={selectedAnswers[i] ? "default" : "outline"}
                      className={`h-10 w-10 p-0 ${currentQuestion === i ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setCurrentQuestion(i)}
                    >
                      {i + 1}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mx-auto mt-8 max-w-3xl"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    size="lg"
                  >
                    Submit Exam
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Submit Exam</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to submit your exam? You have answered {Object.keys(selectedAnswers).length}{" "}
                      out of {exam.totalQuestions} questions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    {Object.keys(selectedAnswers).length < exam.totalQuestions && (
                      <Alert className="mb-4 border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                          You have {exam.totalQuestions - Object.keys(selectedAnswers).length} unanswered questions.
                        </AlertDescription>
                      </Alert>
                    )}
                    <p>Once submitted, you cannot return to the exam.</p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>
                      Cancel
                    </Button>
                    <Button asChild>
                      <Link href={`/my-exams/${params.id}/results`}>Submit Exam</Link>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
          </motion.div>
        ) : (
          <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Begin Exam: {exam.title}</DialogTitle>
                <DialogDescription>
                  You are about to start your exam. Please read the instructions carefully.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4 space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">Exam Information</h3>
                    <ul className="ml-6 list-disc space-y-1 text-sm">
                      <li>Subject: {exam.subject}</li>
                      <li>Duration: {exam.duration}</li>
                      <li>Total Questions: {exam.totalQuestions}</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">Instructions</h3>
                    <p className="text-sm">{exam.instructions}</p>
                  </div>
                  <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
                    <h3 className="mb-2 font-medium text-red-800 dark:text-red-300">Important Rules</h3>
                    <ul className="ml-6 list-disc space-y-1 text-sm text-red-800 dark:text-red-300">
                      <li>Do not refresh the page or navigate away</li>
                      <li>Tab switching is not allowed and will be logged</li>
                      <li>Maintain full-screen mode throughout the exam</li>
                      <li>Your activity will be monitored by AI proctoring</li>
                    </ul>
                  </div>
                </div>
                <p className="text-center font-medium">Are you ready to begin?</p>
              </div>
              <DialogFooter>
                <Button variant="outline" asChild>
                  <Link href="/my-exams">Cancel</Link>
                </Button>
                <Button
                  onClick={startExam}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  Start Exam
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}

