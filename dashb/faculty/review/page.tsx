"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"

interface Question {
  text: string
  options: Record<string, string>
  correctIndex: string
  difficulty: string
}

export default function ReviewPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    // Get questions from localStorage (in a real app, you might use a state management solution or API)
    const storedQuestions = localStorage.getItem("reviewQuestions")

    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions))
    } else {
      // Fallback to demo questions if none are found
      setQuestions([
        {
          text: "What is React?",
          options: { A: "Library", B: "Framework", C: "Language", D: "Tool" },
          correctIndex: "A",
          difficulty: "Medium",
        },
        {
          text: "What is Next.js?",
          options: { A: "Backend", B: "Frontend", C: "Fullstack", D: "Library" },
          correctIndex: "C",
          difficulty: "Medium",
        },
      ])
    }

    setLoading(false)
  }, [])

  const handleConfirmTest = () => {
    // Store questions for the create test page
    localStorage.setItem("testQuestions", JSON.stringify(questions))
    router.push("/dashboard/faculty/create-test")
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
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Review Questions</h1>
            <p className="text-muted-foreground">Review and confirm your selected questions</p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Question Bank
          </Button>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Selected Questions</CardTitle>
              <CardDescription>
                {questions.length} questions selected •{questions.filter((q) => q.difficulty === "Easy").length} Easy •
                {questions.filter((q) => q.difficulty === "Medium").length} Medium •
                {questions.filter((q) => q.difficulty === "Difficult").length} Difficult
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.length > 0 ? (
                  questions.map((q, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{q.text}</h3>
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {q.difficulty}
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {Object.entries(q.options).map(([key, value]) => (
                          <li
                            key={key}
                            className={`flex items-start ${key === q.correctIndex ? "text-primary font-medium" : ""}`}
                          >
                            <span className="mr-2 font-semibold">{key}:</span> {value}
                            {key === q.correctIndex && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-red-500">No questions to review.</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setShowConfirmDialog(true)}>
                Confirm & Create Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Selected Questions</DialogTitle>
            <DialogDescription>
              You have selected {questions.length} questions for your test. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="flex flex-col items-center justify-center rounded-lg border p-3">
              <span className="text-2xl font-bold text-primary">
                {questions.filter((q) => q.difficulty === "Easy").length}
              </span>
              <span className="text-sm text-muted-foreground">Easy</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border p-3">
              <span className="text-2xl font-bold text-primary">
                {questions.filter((q) => q.difficulty === "Medium").length}
              </span>
              <span className="text-sm text-muted-foreground">Medium</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border p-3">
              <span className="text-2xl font-bold text-primary">
                {questions.filter((q) => q.difficulty === "Difficult").length}
              </span>
              <span className="text-sm text-muted-foreground">Difficult</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmTest}>Proceed to Create Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

