"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, FileText, Filter, Search, SlidersHorizontal, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// Mock data for exam results
const mockResults = [
  {
    id: "1",
    examTitle: "Data Structures Final",
    date: "2025-03-15",
    students: 45,
    averageScore: 78.5,
    highestScore: 98,
    lowestScore: 45,
    passRate: 85,
  },
  {
    id: "2",
    examTitle: "Algorithms Midterm",
    date: "2025-03-10",
    students: 38,
    averageScore: 72.3,
    highestScore: 95,
    lowestScore: 40,
    passRate: 78,
  },
  {
    id: "3",
    examTitle: "Database Systems Quiz",
    date: "2025-03-05",
    students: 42,
    averageScore: 81.7,
    highestScore: 100,
    lowestScore: 55,
    passRate: 90,
  },
  {
    id: "4",
    examTitle: "Computer Networks Lab",
    date: "2025-02-28",
    students: 36,
    averageScore: 75.2,
    highestScore: 92,
    lowestScore: 48,
    passRate: 80,
  },
  {
    id: "5",
    examTitle: "Operating Systems Project",
    date: "2025-02-20",
    students: 40,
    averageScore: 83.5,
    highestScore: 97,
    lowestScore: 60,
    passRate: 92,
  },
]

// Mock data for student results
const mockStudentResults = [
  {
    id: "1",
    name: "Alice Johnson",
    examTitle: "Data Structures Final",
    score: 92,
    grade: "A",
    date: "2025-03-15",
    timeSpent: "1h 45m",
    status: "Passed",
  },
  {
    id: "2",
    name: "Bob Smith",
    examTitle: "Data Structures Final",
    score: 78,
    grade: "B",
    date: "2025-03-15",
    timeSpent: "1h 52m",
    status: "Passed",
  },
  {
    id: "3",
    name: "Charlie Brown",
    examTitle: "Data Structures Final",
    score: 85,
    grade: "B+",
    date: "2025-03-15",
    timeSpent: "1h 38m",
    status: "Passed",
  },
  {
    id: "4",
    name: "Diana Prince",
    examTitle: "Data Structures Final",
    score: 45,
    grade: "F",
    date: "2025-03-15",
    timeSpent: "2h 00m",
    status: "Failed",
  },
  {
    id: "5",
    name: "Ethan Hunt",
    examTitle: "Data Structures Final",
    score: 88,
    grade: "B+",
    date: "2025-03-15",
    timeSpent: "1h 30m",
    status: "Passed",
  },
  {
    id: "6",
    name: "Fiona Gallagher",
    examTitle: "Data Structures Final",
    score: 95,
    grade: "A",
    date: "2025-03-15",
    timeSpent: "1h 25m",
    status: "Passed",
  },
  {
    id: "7",
    name: "George Miller",
    examTitle: "Data Structures Final",
    score: 65,
    grade: "C",
    date: "2025-03-15",
    timeSpent: "1h 55m",
    status: "Passed",
  },
  {
    id: "8",
    name: "Hannah Baker",
    examTitle: "Data Structures Final",
    score: 72,
    grade: "C+",
    date: "2025-03-15",
    timeSpent: "1h 48m",
    status: "Passed",
  },
]

// Chart data
const gradeDistribution = [
  { name: "A", value: 15 },
  { name: "B", value: 20 },
  { name: "C", value: 10 },
  { name: "D", value: 5 },
  { name: "F", value: 3 },
]

const scoreRanges = [
  { name: "90-100", count: 12 },
  { name: "80-89", count: 18 },
  { name: "70-79", count: 15 },
  { name: "60-69", count: 8 },
  { name: "50-59", count: 4 },
  { name: "0-49", count: 3 },
]

const COLORS = ["#4f46e5", "#8b5cf6", "#ec4899", "#f97316", "#ef4444"]

export default function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExam, setSelectedExam] = useState<string | null>(null)

  const filteredResults = mockResults.filter((result) =>
    result.examTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredStudentResults = selectedExam
    ? mockStudentResults.filter((result) => result.examTitle === selectedExam)
    : mockStudentResults

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
                  <BreadcrumbPage>Results</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-3xl font-bold tracking-tight mt-2">Exam Results</h2>
          </div>

          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockResults.length}</div>
                <p className="text-xs text-muted-foreground">
                  {mockResults.reduce((acc, result) => acc + result.students, 0)} total submissions
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(mockResults.reduce((acc, result) => acc + result.averageScore, 0) / mockResults.length).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Across all exams</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.max(...mockResults.map((result) => result.highestScore))}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {
                    mockResults.find(
                      (result) => result.highestScore === Math.max(...mockResults.map((r) => r.highestScore)),
                    )?.examTitle
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(mockResults.reduce((acc, result) => acc + result.passRate, 0) / mockResults.length).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Average pass rate</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="exams" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="exams" className="relative overflow-hidden group">
              <span className="relative z-10">Exam Results</span>
              <motion.div
                layoutId="tab-indicator-results"
                className="absolute inset-0 bg-primary/10 dark:bg-primary/20 -z-0"
                transition={{ type: "spring", duration: 0.5 }}
              />
            </TabsTrigger>
            <TabsTrigger value="students" className="relative overflow-hidden group">
              <span className="relative z-10">Student Results</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="relative overflow-hidden group">
              <span className="relative z-10">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full items-center space-x-2 md:w-2/3">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search exams..."
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
                <CardTitle>Exam Results</CardTitle>
                <CardDescription>View and analyze results from all exams</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Pass Rate</TableHead>
                      <TableHead>Score Range</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result, index) => (
                      <motion.tr
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedExam(result.examTitle)}
                      >
                        <TableCell className="font-medium">{result.examTitle}</TableCell>
                        <TableCell>{format(parseISO(result.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{result.students}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-2">{result.averageScore.toFixed(1)}%</span>
                            <Progress value={result.averageScore} className="h-2 w-16" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              result.passRate >= 90
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : result.passRate >= 75
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            }
                          >
                            {result.passRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-xs">
                            <span>{result.lowestScore}%</span>
                            <span className="text-muted-foreground">-</span>
                            <span>{result.highestScore}%</span>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}

                    {filteredResults.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <div className="text-muted-foreground">No exam results found</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full items-center space-x-2 md:w-2/3">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search students..." className="w-full pl-8" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedExam || ""} onValueChange={(value) => setSelectedExam(value || null)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exams</SelectItem>
                    {mockResults.map((result) => (
                      <SelectItem key={result.id} value={result.examTitle}>
                        {result.examTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Results</CardTitle>
                <CardDescription>
                  {selectedExam
                    ? `Viewing results for ${selectedExam}`
                    : "View individual student performance across all exams"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time Spent</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudentResults.map((result, index) => (
                      <motion.tr
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="group"
                      >
                        <TableCell className="font-medium">{result.name}</TableCell>
                        <TableCell>{result.examTitle}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-2">{result.score}%</span>
                            <Progress value={result.score} className="h-2 w-16" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              result.grade === "A"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : result.grade.startsWith("B")
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : result.grade.startsWith("C")
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                    : result.grade.startsWith("D")
                                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }
                          >
                            {result.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(parseISO(result.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{result.timeSpent}</TableCell>
                        <TableCell>
                          <Badge
                            variant={result.status === "Passed" ? "outline" : "destructive"}
                            className={
                              result.status === "Passed"
                                ? "border-green-500 bg-green-100 text-green-800 dark:border-green-500 dark:bg-green-900/20 dark:text-green-300"
                                : ""
                            }
                          >
                            {result.status}
                          </Badge>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Distribution of scores across all exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scoreRanges} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Distribution of grades across all exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gradeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Average scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockResults.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="examTitle" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="averageScore" name="Average Score" fill="#4f46e5" />
                      <Bar dataKey="passRate" name="Pass Rate" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}

