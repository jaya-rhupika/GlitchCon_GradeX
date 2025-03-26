"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Clock, FileText, Plus, Save, Settings, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CreateExamPage() {
  const [questions, setQuestions] = useState([
    {
      id: "1",
      text: "What is the time complexity of quicksort in the average case?",
      type: "multiple-choice",
      options: [
        { id: "a", text: "O(n)" },
        { id: "b", text: "O(n log n)" },
        { id: "c", text: "O(n²)" },
        { id: "d", text: "O(log n)" },
      ],
      correctAnswer: "b",
      difficulty: "medium",
    },
  ])

  const addQuestion = () => {
    const newQuestion = {
      id: String(questions.length + 1),
      text: "",
      type: "multiple-choice",
      options: [
        { id: "a", text: "" },
        { id: "b", text: "" },
        { id: "c", text: "" },
        { id: "d", text: "" },
      ],
      correctAnswer: "",
      difficulty: "medium",
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Create Exam</h2>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">
            <FileText className="mr-2 h-4 w-4" />
            Exam Details
          </TabsTrigger>
          <TabsTrigger value="questions">
            <FileText className="mr-2 h-4 w-4" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for your exam</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title</Label>
                  <Input id="title" placeholder="e.g., Data Structures Final Exam" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select defaultValue="cs">
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter a description of the exam" className="min-h-[100px]" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="date" type="date" className="pl-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="start-time" type="time" className="pl-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" min="1" defaultValue="60" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Add and manage questions for your exam</CardDescription>
              </div>
              <Button onClick={addQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Question {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(question.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete question</span>
                    </Button>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${question.id}`}>Question Text</Label>
                      <Textarea
                        id={`question-${question.id}`}
                        defaultValue={question.text}
                        placeholder="Enter your question here"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`question-type-${question.id}`}>Question Type</Label>
                        <Select defaultValue={question.type}>
                          <SelectTrigger id={`question-type-${question.id}`}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                            <SelectItem value="true-false">True/False</SelectItem>
                            <SelectItem value="short-answer">Short Answer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`difficulty-${question.id}`}>Difficulty</Label>
                        <Select defaultValue={question.difficulty}>
                          <SelectTrigger id={`difficulty-${question.id}`}>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Answer Options</Label>
                      <RadioGroup defaultValue={question.correctAnswer}>
                        {question.options.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.id} id={`option-${question.id}-${option.id}`} />
                            <Input
                              defaultValue={option.text}
                              placeholder={`Option ${option.id.toUpperCase()}`}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground">No questions added yet</p>
                  <Button variant="outline" className="mt-4" onClick={addQuestion}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exam Settings</CardTitle>
              <CardDescription>Configure security and proctoring settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="randomize" />
                    <Label htmlFor="randomize">Randomize question order</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="prevent-tab-switch" defaultChecked />
                    <Label htmlFor="prevent-tab-switch">Prevent tab switching</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fullscreen" defaultChecked />
                    <Label htmlFor="fullscreen">Enforce fullscreen mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="auto-submit" defaultChecked />
                    <Label htmlFor="auto-submit">Auto-submit on timeout</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">AI Proctoring</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="face-tracking" defaultChecked />
                    <Label htmlFor="face-tracking">Enable face tracking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="eye-tracking" />
                    <Label htmlFor="eye-tracking">Enable eye movement tracking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="behavior-monitoring" defaultChecked />
                    <Label htmlFor="behavior-monitoring">Enable behavior monitoring</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Results Settings</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="instant-results" defaultChecked />
                    <Label htmlFor="instant-results">Show results immediately after submission</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-correct-answers" />
                    <Label htmlFor="show-correct-answers">Show correct answers after submission</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ai-feedback" defaultChecked />
                    <Label htmlFor="ai-feedback">Enable AI-based feedback</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/exams">Cancel</Link>
        </Button>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Exam
        </Button>
      </div>
    </div>
  )
}

