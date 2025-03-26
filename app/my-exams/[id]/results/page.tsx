"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle2, Clock, Download, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

export default function ExamResultsPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(true)

  // Mock exam result data
  const examResult = {
    id: params.id,
    title: "Data Structures Final",
    subject: "Computer Science",
    date: "December 15, 2023",
    time: "10:00 AM - 12:00 PM",
    duration: "2 hours",
    score: 85,
    totalScore: 100,
    grade: "A-",
    timeSpent: "1 hour 45 minutes",
    correctAnswers: 38,
    incorrectAnswers: 7,
    totalQuestions: 45,
    performance: {
      arrays: { score: 90, total: 100 },
      linkedLists: { score: 80, total: 100 },
      trees: { score: 85, total: 100 },
      graphs: { score: 75, total: 100 },
      sorting: { score: 95, total: 100 },
    },
    questions: Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      text: `This is question ${i + 1} about data structures. What is the time complexity of searching in a balanced binary search tree?`,
      userAnswer: i % 5 === 0 ? "c" : "b",
      correctAnswer: "b",
      isCorrect: i % 5 !== 0,
      explanation:
        "The time complexity of searching in a balanced binary search tree is O(log n) because at each step, we eliminate half of the remaining nodes.",
      topic:
        i % 5 === 0
          ? "arrays"
          : i % 5 === 1
            ? "linkedLists"
            : i % 5 === 2
              ? "trees"
              : i % 5 === 3
                ? "graphs"
                : "sorting",
      options: [
        { id: "a", text: "O(1)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n)" },
        { id: "d", text: "O(n log n)" },
      ],
    })),
  }

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Calculate percentages
  const scorePercentage = Math.round((examResult.score / examResult.totalScore) * 100)
  const correctPercentage = Math.round((examResult.correctAnswers / examResult.totalQuestions) * 100)

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

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" disabled className="mr-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted"></div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonCard withDescription />
          <SkeletonCard withDescription />
        </div>

        <SkeletonCard aspectRatio="video" withDescription />

        <div className="mt-6">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-muted"></div>
          <div className="mt-4 grid gap-4">
            <SkeletonCard aspectRatio="video" withDescription />
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {showFeedback && (
          <NotificationBanner
            title="Your results are ready!"
            description="We've analyzed your performance and provided personalized feedback."
            variant="success"
            onOpenChange={setShowFeedback}
            className="mb-4"
            action={
              <Button variant="outline" size="sm" asChild>
                <Link href="#">View Certificate</Link>
              </Button>
            }
          />
        )}

        <div className="flex items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/my-exams">My Exams</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Results</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h2 className="text-3xl font-bold tracking-tight">
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Exam Results
          </motion.span>
        </h2>

        <motion.div
          className="grid gap-4 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle>{examResult.title}</CardTitle>
                <CardDescription>{examResult.subject}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <motion.div
                    className="relative pt-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold text-primary">{examResult.grade}</div>
                    </div>
                    <svg viewBox="0 0 36 36" className="h-32 w-32 mx-auto -rotate-90">
                      <path
                        className="fill-none stroke-muted"
                        strokeWidth="3.8"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="fill-none stroke-primary"
                        strokeWidth="3.8"
                        strokeDasharray={`${scorePercentage}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Score</div>
                      <div className="text-xl font-bold">
                        {examResult.score}/{examResult.totalScore}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Time Spent</div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{examResult.timeSpent}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Correct</div>
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <span>
                          {examResult.correctAnswers} ({correctPercentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Incorrect</div>
                      <div className="flex items-center">
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        <span>
                          {examResult.incorrectAnswers} ({100 - correctPercentage}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    className="pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <Button className="w-full" asChild>
                      <Link href="#">
                        <Download className="mr-2 h-4 w-4" />
                        Download Certificate
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Performance by Topic</CardTitle>
                <CardDescription>Your performance across different topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(examResult.performance).map(([topic, { score, total }], index) => (
                    <motion.div
                      key={topic}
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    >
                      <div className="flex justify-between">
                        <div className="capitalize text-sm">{topic}</div>
                        <div className="text-sm font-medium">
                          {score}/{total} ({Math.round((score / total) * 100)}%)
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={(score / total) * 100} className="h-2" />
                        <motion.div
                          className="absolute -top-1 h-4 w-1 bg-primary rounded-full"
                          initial={{ left: "50%" }}
                          animate={{ left: `${(score / total) * 100}%` }}
                          transition={{
                            delay: 0.7 + index * 0.1,
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Feedback</CardTitle>
              <CardDescription>Personalized insights based on your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <motion.div
                  className="rounded-lg border p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  whileHover={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)", y: -2 }}
                >
                  <h3 className="mb-2 font-medium">Strengths</h3>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Excellent understanding of sorting algorithms (95% score)</li>
                    <li>Strong grasp of array operations and manipulations</li>
                    <li>Good understanding of tree data structures</li>
                  </ul>
                </motion.div>

                <motion.div
                  className="rounded-lg border p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                  whileHover={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)", y: -2 }}
                >
                  <h3 className="mb-2 font-medium">Areas for Improvement</h3>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Focus on graph algorithms and traversal techniques</li>
                    <li>Review linked list operations, especially insertion and deletion</li>
                    <li>Practice more complex tree problems</li>
                  </ul>
                </motion.div>

                <motion.div
                  className="rounded-lg border p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                  whileHover={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)", y: -2 }}
                >
                  <h3 className="mb-2 font-medium">Recommended Resources</h3>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Graph Theory Fundamentals (Online Course)</li>
                    <li>Advanced Data Structures Handbook (Chapter 4-6)</li>
                    <li>Practice problems on linked lists and trees</li>
                  </ul>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="all" className="relative overflow-hidden group">
              <span className="relative z-10">All Questions</span>
              <motion.div
                layoutId="tab-indicator-results"
                className="absolute inset-0 bg-primary/10 dark:bg-primary/20 -z-0"
                transition={{ type: "spring", duration: 0.5 }}
              />
            </TabsTrigger>
            <TabsTrigger value="correct" className="relative overflow-hidden group">
              <span className="relative z-10">Correct ({examResult.correctAnswers})</span>
            </TabsTrigger>
            <TabsTrigger value="incorrect" className="relative overflow-hidden group">
              <span className="relative z-10">Incorrect ({examResult.incorrectAnswers})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {examResult.questions.slice(0, 5).map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-base">Question {question.id}</CardTitle>
                      <CardDescription className="text-xs">{question.topic}</CardDescription>
                    </div>
                    <Badge
                      variant={question.isCorrect ? "outline" : "destructive"}
                      className={
                        question.isCorrect
                          ? "border-green-500 bg-green-100 text-green-800 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300"
                          : ""
                      }
                    >
                      {question.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{question.text}</p>

                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <motion.div
                          key={option.id}
                          whileHover={{ x: 5 }}
                          className={`flex items-center rounded-md border p-3 ${
                            option.id === question.correctAnswer
                              ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                              : option.id === question.userAnswer && !question.isCorrect
                                ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                                : ""
                          }`}
                        >
                          <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border">
                            {option.id}
                          </div>
                          <div className="flex-1">{option.text}</div>
                          {option.id === question.correctAnswer && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                            >
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </motion.div>
                          )}
                          {option.id === question.userAnswer && !question.isCorrect && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                            >
                              <XCircle className="h-5 w-5 text-red-500" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {!question.isCorrect && (
                      <motion.div
                        className="rounded-md bg-muted p-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      >
                        <h4 className="mb-2 font-medium">Explanation</h4>
                        <p className="text-sm">{question.explanation}</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            <div className="flex justify-center pt-4">
              <Button variant="outline">Load More Questions</Button>
            </div>
          </TabsContent>

          <TabsContent value="correct" className="space-y-4">
            {examResult.questions
              .filter((q) => q.isCorrect)
              .slice(0, 3)
              .map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base">Question {question.id}</CardTitle>
                        <CardDescription className="text-xs">{question.topic}</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-green-500 bg-green-100 text-green-800 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300"
                      >
                        Correct
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{question.text}</p>

                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <motion.div
                            key={option.id}
                            whileHover={{ x: 5 }}
                            className={`flex items-center rounded-md border p-3 ${
                              option.id === question.correctAnswer
                                ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                                : ""
                            }`}
                          >
                            <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border">
                              {option.id}
                            </div>
                            <div className="flex-1">{option.text}</div>
                            {option.id === question.correctAnswer && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                              >
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            <div className="flex justify-center pt-4">
              <Button variant="outline">Load More Questions</Button>
            </div>
          </TabsContent>

          <TabsContent value="incorrect" className="space-y-4">
            {examResult.questions
              .filter((q) => !q.isCorrect)
              .slice(0, 3)
              .map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base">Question {question.id}</CardTitle>
                        <CardDescription className="text-xs">{question.topic}</CardDescription>
                      </div>
                      <Badge variant="destructive">Incorrect</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{question.text}</p>

                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <motion.div
                            key={option.id}
                            whileHover={{ x: 5 }}
                            className={`flex items-center rounded-md border p-3 ${
                              option.id === question.correctAnswer
                                ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                                : option.id === question.userAnswer
                                  ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                                  : ""
                            }`}
                          >
                            <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border">
                              {option.id}
                            </div>
                            <div className="flex-1">{option.text}</div>
                            {option.id === question.correctAnswer && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                              >
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              </motion.div>
                            )}
                            {option.id === question.userAnswer && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                              >
                                <XCircle className="h-5 w-5 text-red-500" />
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        className="rounded-md bg-muted p-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      >
                        <h4 className="mb-2 font-medium">Explanation</h4>
                        <p className="text-sm">{question.explanation}</p>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            <div className="flex justify-center pt-4">
              <Button variant="outline">Load More Questions</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}

