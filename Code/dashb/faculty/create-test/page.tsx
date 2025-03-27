"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Question {
  text: string
  options: Record<string, string>
  correctIndex: string
  difficulty: string
}

export default function CreateTestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [questions, setQuestions] = useState<Question[]>([])
  const [totalTime, setTotalTime] = useState(30)
  const [loading, setLoading] = useState(false)
  const [classId, setClassId] = useState("")
  const [testName, setTestName] = useState("")
  const [testDate, setTestDate] = useState("")

  // Mock Class IDs (Replace with API fetch if needed)
  const classOptions = ["A1", "B2", "C3", "D4"]

  useEffect(() => {
    // Get questions from localStorage (in a real app, you might use a state management solution or API)
    const storedQuestions = localStorage.getItem("testQuestions")

    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions))
    } else {
      // Redirect back if no questions are found
      router.push("/dashboard/faculty/question-bank")
    }

    // Set default test date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setTestDate(tomorrow.toISOString().split("T")[0])
  }, [router])

  const getQuestionCountByDifficulty = (difficulty: string) =>
    questions.filter((q) => q.difficulty === difficulty).length

  const handleSaveTest = async () => {
    if (!classId) {
      toast({
        title: "Missing information",
        description: "Please select a Class ID",
        variant: "destructive",
      })
      return
    }

    if (!testName) {
      toast({
        title: "Missing information",
        description: "Please enter a test name",
        variant: "destructive",
      })
      return
    }

    if (!testDate) {
      toast({
        title: "Missing information",
        description: "Please select a test date",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const testData = {
      testName,
      classId,
      scheduledDate: testDate,
      totalQuestions: questions.length,
      easy: getQuestionCountByDifficulty("Easy"),
      medium: getQuestionCountByDifficulty("Medium"),
      difficult: getQuestionCountByDifficulty("Difficult"),
      totalTime,
      questions,
    }

    try {
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate a successful save
      setTimeout(() => {
        toast({
          title: "Test created successfully",
          description: `${testName} has been scheduled for ${new Date(testDate).toLocaleDateString()}`,
        })

        // Clear stored questions
        localStorage.removeItem("testQuestions")
        localStorage.removeItem("reviewQuestions")

        // Redirect to faculty dashboard
        router.push("/dashboard/faculty")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save test. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Test</h1>
          <p className="text-muted-foreground">Configure your test settings</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Review
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
            <CardDescription>Overview of your test questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Total Questions</div>
                <div className="text-2xl font-bold">{questions.length}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Easy</div>
                <div className="text-2xl font-bold">{getQuestionCountByDifficulty("Easy")}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Medium</div>
                <div className="text-2xl font-bold">{getQuestionCountByDifficulty("Medium")}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Difficult</div>
                <div className="text-2xl font-bold">{getQuestionCountByDifficulty("Difficult")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Set up your test details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="test-name">Test Name</Label>
                <Input
                  id="test-name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g., Midterm Exam"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-id">Class ID</Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger id="class-id">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="test-date">Test Date</Label>
                <Input id="test-date" type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-time">Total Time (Minutes)</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="total-time"
                    type="number"
                    min={5}
                    value={totalTime}
                    onChange={(e) => setTotalTime(Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveTest} disabled={loading}>
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Test
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  )
}

