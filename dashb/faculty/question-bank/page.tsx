"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle } from "lucide-react"

interface MCQ {
  question: string
  options: Record<string, string>
  answer: string
  difficulty: string
}

export default function QuestionBankPage() {
  const [topic, setTopic] = useState("")
  const [mcqs, setMcqs] = useState<MCQ[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedQuestions, setSelectedQuestions] = useState<{ text: string; answer: string; difficulty: string }[]>([])

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // For demo purposes, we'll generate mock MCQs
      // In a real app, you would call your API
      setTimeout(() => {
        const mockMcqs: MCQ[] = [
          {
            question: "What is React?",
            options: {
              A: "A JavaScript library for building user interfaces",
              B: "A programming language",
              C: "A database system",
              D: "An operating system",
            },
            answer: "A",
            difficulty: "Easy",
          },
          {
            question: "What does JSX stand for?",
            options: {
              A: "JavaScript XML",
              B: "JavaScript Extension",
              C: "JavaScript Syntax",
              D: "Java Syntax Extension",
            },
            answer: "A",
            difficulty: "Medium",
          },
          {
            question: "Which hook is used for side effects in React?",
            options: { A: "useState", B: "useEffect", C: "useContext", D: "useReducer" },
            answer: "B",
            difficulty: "Medium",
          },
          {
            question: "What is the virtual DOM?",
            options: {
              A: "A direct copy of the real DOM",
              B: "A lightweight copy of the real DOM in memory",
              C: "A programming concept",
              D: "A browser feature",
            },
            answer: "B",
            difficulty: "Difficult",
          },
          {
            question: "What is a React component?",
            options: { A: "A JavaScript function", B: "A reusable piece of UI", C: "A CSS class", D: "A HTML element" },
            answer: "B",
            difficulty: "Easy",
          },
        ]
        setMcqs(mockMcqs)
        setLoading(false)
      }, 1500)
    } catch (err) {
      setError("An error occurred while fetching MCQs.")
      setLoading(false)
    }
  }

  const toggleQuestionSelection = (question: MCQ) => {
    setSelectedQuestions((prev) =>
      prev.some((q) => q.text === question.question)
        ? prev.filter((q) => q.text !== question.question)
        : [...prev, { text: question.question, answer: question.answer, difficulty: question.difficulty }],
    )
  }

  const handleReviewQuestions = () => {
    if (selectedQuestions.length === 0) {
      setError("Please select at least one question before proceeding.")
      return
    }

    // Convert selected questions to the format expected by the review page
    const reviewQuestions = selectedQuestions.map((q) => ({
      text: q.text,
      options: mcqs.find((mcq) => mcq.question === q.text)?.options || {},
      correctIndex: q.answer,
      difficulty: q.difficulty,
    }))

    // Store in localStorage for demo purposes
    // In a real app, you might use a state management solution or API
    localStorage.setItem("reviewQuestions", JSON.stringify(reviewQuestions))

    router.push("/dashboard/faculty/review")
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

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
        <p className="text-muted-foreground">Generate and select questions for your exams</p>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Generate Questions</CardTitle>
            <CardDescription>Enter a topic to generate multiple-choice questions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic (e.g., React, JavaScript, Physics)"
                className="flex-1"
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate MCQs"
                )}
              </Button>
            </form>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </CardContent>
        </Card>
      </motion.div>

      {mcqs.length > 0 && (
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Questions</CardTitle>
                <CardDescription>Select questions to include in your exam</CardDescription>
              </div>
              {selectedQuestions.length > 0 && (
                <Button onClick={handleReviewQuestions}>Review Selected ({selectedQuestions.length})</Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mcqs.map((mcq, index) => (
                  <div
                    key={index}
                    className={`relative rounded-lg border p-4 transition-colors ${
                      selectedQuestions.some((q) => q.text === mcq.question)
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/20"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 rounded-full p-0"
                          onClick={() => toggleQuestionSelection(mcq)}
                        >
                          {selectedQuestions.some((q) => q.text === mcq.question) ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2" />
                          )}
                        </Button>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{mcq.question}</h3>
                          <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            {mcq.difficulty}
                          </span>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {Object.entries(mcq.options).map(([key, value]) => (
                            <li key={key} className="flex items-start">
                              <span className="mr-2 font-semibold">{key}:</span>
                              <span className={key === mcq.answer ? "font-medium text-primary" : ""}>{value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

