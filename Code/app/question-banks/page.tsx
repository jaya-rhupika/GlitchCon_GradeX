"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, ChevronDown, Edit, Filter, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"

// Mock data for question banks
const mockQuestionBanks = [
  {
    id: "1",
    title: "Data Structures",
    subject: "Computer Science",
    questions: 120,
    lastUpdated: "2025-03-15",
    difficulty: "Medium",
    categories: ["Arrays", "Linked Lists", "Trees", "Graphs"],
  },
  {
    id: "2",
    title: "Algorithms",
    subject: "Computer Science",
    questions: 85,
    lastUpdated: "2025-03-10",
    difficulty: "Hard",
    categories: ["Sorting", "Searching", "Dynamic Programming"],
  },
  {
    id: "3",
    title: "Database Systems",
    subject: "Computer Science",
    questions: 95,
    lastUpdated: "2025-03-05",
    difficulty: "Medium",
    categories: ["SQL", "Normalization", "Transactions"],
  },
  {
    id: "4",
    title: "Computer Networks",
    subject: "Computer Science",
    questions: 75,
    lastUpdated: "2025-02-28",
    difficulty: "Medium",
    categories: ["OSI Model", "TCP/IP", "Routing"],
  },
  {
    id: "5",
    title: "Operating Systems",
    subject: "Computer Science",
    questions: 110,
    lastUpdated: "2025-02-20",
    difficulty: "Hard",
    categories: ["Process Management", "Memory Management", "File Systems"],
  },
]

// Mock data for questions
const mockQuestions = [
  {
    id: "1",
    text: "What is the time complexity of quicksort in the average case?",
    type: "multiple-choice",
    difficulty: "Medium",
    category: "Sorting",
    options: [
      { id: "a", text: "O(n)" },
      { id: "b", text: "O(n log n)" },
      { id: "c", text: "O(n²)" },
      { id: "d", text: "O(log n)" },
    ],
    correctAnswer: "b",
  },
  {
    id: "2",
    text: "Which data structure is used to implement recursion?",
    type: "multiple-choice",
    difficulty: "Easy",
    category: "Data Structures",
    options: [
      { id: "a", text: "Queue" },
      { id: "b", text: "Stack" },
      { id: "c", text: "Linked List" },
      { id: "d", text: "Array" },
    ],
    correctAnswer: "b",
  },
  {
    id: "3",
    text: "What is the worst-case time complexity of binary search?",
    type: "multiple-choice",
    difficulty: "Easy",
    category: "Searching",
    options: [
      { id: "a", text: "O(1)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(n log n)" },
    ],
    correctAnswer: "b",
  },
  {
    id: "4",
    text: "Which of the following is not a balanced binary search tree?",
    type: "multiple-choice",
    difficulty: "Medium",
    category: "Trees",
    options: [
      { id: "a", text: "AVL Tree" },
      { id: "b", text: "Red-Black Tree" },
      { id: "c", text: "B-Tree" },
      { id: "d", text: "Binary Tree" },
    ],
    correctAnswer: "d",
  },
  {
    id: "5",
    text: "What is the primary advantage of using a hash table?",
    type: "multiple-choice",
    difficulty: "Medium",
    category: "Data Structures",
    options: [
      { id: "a", text: "Ordered data storage" },
      { id: "b", text: "O(1) average case for search, insert, and delete" },
      { id: "c", text: "Memory efficiency" },
      { id: "d", text: "Simplicity of implementation" },
    ],
    correctAnswer: "b",
  },
]

export default function QuestionBanksPage() {
  const { toast } = useToast()
  const [questionBanks, setQuestionBanks] = useState(mockQuestionBanks)
  const [questions, setQuestions] = useState(mockQuestions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [isAddBankOpen, setIsAddBankOpen] = useState(false)
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)

  const filteredBanks = questionBanks.filter(
    (bank) =>
      bank.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const title = formData.get("title") as string
    const subject = formData.get("subject") as string
    const difficulty = formData.get("difficulty") as string

    const newBank = {
      id: (questionBanks.length + 1).toString(),
      title,
      subject,
      questions: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
      difficulty,
      categories: [],
    }

    setQuestionBanks([...questionBanks, newBank])
    setIsAddBankOpen(false)

    toast({
      title: "Question Bank Created",
      description: `${title} has been created successfully`,
    })
  }

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const text = formData.get("text") as string
    const type = formData.get("type") as string
    const difficulty = formData.get("difficulty") as string
    const category = formData.get("category") as string
    const correctAnswer = formData.get("correctAnswer") as string

    const options = [
      { id: "a", text: formData.get("option-a") as string },
      { id: "b", text: formData.get("option-b") as string },
      { id: "c", text: formData.get("option-c") as string },
      { id: "d", text: formData.get("option-d") as string },
    ]

    const newQuestion = {
      id: (questions.length + 1).toString(),
      text,
      type,
      difficulty,
      category,
      options,
      correctAnswer,
    }

    setQuestions([...questions, newQuestion])

    // Update question count in the selected bank
    if (selectedBank) {
      setQuestionBanks(
        questionBanks.map((bank) =>
          bank.id === selectedBank
            ? { ...bank, questions: bank.questions + 1, lastUpdated: new Date().toISOString().split("T")[0] }
            : bank,
        ),
      )
    }

    setIsAddQuestionOpen(false)

    toast({
      title: "Question Added",
      description: "The question has been added to the bank successfully",
    })
  }

  const handleDeleteBank = (id: string) => {
    setQuestionBanks(questionBanks.filter((bank) => bank.id !== id))

    toast({
      title: "Question Bank Deleted",
      description: "The question bank has been deleted successfully",
      variant: "destructive",
    })
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((question) => question.id !== id))

    toast({
      title: "Question Deleted",
      description: "The question has been deleted successfully",
      variant: "destructive",
    })
  }

  return (
    <PageTransition>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Question Banks</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-3xl font-bold tracking-tight mt-2">Question Banks</h2>
          </div>

          <Button onClick={() => setIsAddBankOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Bank
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center space-x-2 md:w-2/3">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search question banks..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
            <CardTitle>Manage Question Banks</CardTitle>
            <CardDescription>Create, edit, and manage your question banks</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanks.map((bank, index) => (
                  <Collapsible key={bank.id} asChild>
                    <>
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="group"
                      >
                        <TableCell className="font-medium">{bank.title}</TableCell>
                        <TableCell>{bank.subject}</TableCell>
                        <TableCell>{bank.questions}</TableCell>
                        <TableCell>{bank.lastUpdated}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              bank.difficulty === "Easy"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : bank.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }
                          >
                            {bank.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Toggle questions</span>
                              </Button>
                            </CollapsibleTrigger>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBank(bank.id)
                                    setIsAddQuestionOpen(true)
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  <span>Add Question</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit Bank</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteBank(bank.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete Bank</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </motion.tr>
                      <CollapsibleContent asChild>
                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <TableCell colSpan={6} className="p-0">
                            <div className="bg-muted/50 p-4">
                              <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-sm font-medium">Questions in {bank.title}</h4>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedBank(bank.id)
                                    setIsAddQuestionOpen(true)
                                  }}
                                >
                                  <Plus className="mr-2 h-3 w-3" />
                                  Add Question
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {questions.slice(0, 3).map((question, qIndex) => (
                                  <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: qIndex * 0.1, duration: 0.3 }}
                                    className="rounded-md border bg-background p-3"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-1">
                                        <p className="text-sm">{question.text}</p>
                                        <div className="flex items-center space-x-2">
                                          <Badge variant="outline" className="text-xs">
                                            {question.type}
                                          </Badge>
                                          <Badge
                                            className={
                                              question.difficulty === "Easy"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs"
                                                : question.difficulty === "Medium"
                                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs"
                                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs"
                                            }
                                          >
                                            {question.difficulty}
                                          </Badge>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                      >
                                        <Trash2 className="h-3 w-3 text-destructive" />
                                      </Button>
                                    </div>
                                  </motion.div>
                                ))}
                                {questions.length > 3 && (
                                  <Button variant="link" size="sm" className="mt-2">
                                    View all {questions.length} questions
                                  </Button>
                                )}
                                {questions.length === 0 && (
                                  <div className="flex h-20 items-center justify-center rounded-md border bg-background">
                                    <p className="text-sm text-muted-foreground">No questions in this bank yet</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </motion.tr>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))}

                {filteredBanks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                        <div className="text-muted-foreground">No question banks found</div>
                        <Button variant="outline" size="sm" onClick={() => setIsAddBankOpen(true)}>
                          Create a new question bank
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Question Bank Dialog */}
        <Dialog open={isAddBankOpen} onOpenChange={setIsAddBankOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Question Bank</DialogTitle>
              <DialogDescription>Create a new question bank to organize your questions</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBank}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Data Structures" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select name="subject" defaultValue="Computer Science" required>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Default Difficulty</Label>
                  <Select name="difficulty" defaultValue="Medium" required>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddBankOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Bank</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Question Dialog */}
        <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Question</DialogTitle>
              <DialogDescription>Add a new question to the selected question bank</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddQuestion}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="text">Question Text</Label>
                  <Textarea
                    id="text"
                    name="text"
                    placeholder="Enter your question here"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Question Type</Label>
                    <Select name="type" defaultValue="multiple-choice" required>
                      <SelectTrigger id="type">
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
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select name="difficulty" defaultValue="Medium" required>
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" placeholder="e.g., Arrays, Sorting, etc." required />
                </div>

                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border">A</div>
                      <Input id="option-a" name="option-a" placeholder="Option A" required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border">B</div>
                      <Input id="option-b" name="option-b" placeholder="Option B" required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border">C</div>
                      <Input id="option-c" name="option-c" placeholder="Option C" required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border">D</div>
                      <Input id="option-d" name="option-d" placeholder="Option D" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correctAnswer">Correct Answer</Label>
                  <Select name="correctAnswer" defaultValue="a" required>
                    <SelectTrigger id="correctAnswer">
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Option A</SelectItem>
                      <SelectItem value="b">Option B</SelectItem>
                      <SelectItem value="c">Option C</SelectItem>
                      <SelectItem value="d">Option D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddQuestionOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Question</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  )
}

