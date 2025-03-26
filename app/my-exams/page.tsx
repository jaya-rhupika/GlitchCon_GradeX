import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText } from "lucide-react"

export default function MyExamsPage() {
  // Mock data for upcoming exams
  const upcomingExams = [
    {
      id: "1",
      title: "Data Structures Final",
      subject: "Computer Science",
      date: "December 15, 2023",
      time: "10:00 AM - 12:00 PM",
      duration: "2 hours",
      questions: 45,
      status: "Scheduled",
    },
    {
      id: "2",
      title: "Advanced Algorithms Quiz",
      subject: "Computer Science",
      date: "December 5, 2023",
      time: "9:00 AM - 10:00 AM",
      duration: "1 hour",
      questions: 20,
      status: "Scheduled",
    },
    {
      id: "3",
      title: "Machine Learning Project Defense",
      subject: "Computer Science",
      date: "December 20, 2023",
      time: "1:00 PM - 5:00 PM",
      duration: "4 hours",
      questions: 10,
      status: "Scheduled",
    },
  ]

  // Mock data for completed exams
  const completedExams = [
    {
      id: "4",
      title: "Database Systems Midterm",
      subject: "Computer Science",
      date: "November 10, 2023",
      time: "2:00 PM - 4:00 PM",
      duration: "2 hours",
      questions: 30,
      status: "Completed",
      score: "85/100",
      grade: "A-",
    },
    {
      id: "5",
      title: "Software Engineering Quiz",
      subject: "Computer Science",
      date: "October 25, 2023",
      time: "11:00 AM - 12:00 PM",
      duration: "1 hour",
      questions: 15,
      status: "Completed",
      score: "78/100",
      grade: "B+",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Exams</h2>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
          <TabsTrigger value="completed">Completed Exams</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingExams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>{exam.title}</CardTitle>
                  <CardDescription>{exam.subject}</CardDescription>
                </div>
                <Badge>{exam.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {exam.questions} questions • {exam.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end justify-end">
                    <Button asChild>
                      <Link href={`/my-exams/${exam.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {upcomingExams.length === 0 && (
            <Card>
              <CardContent className="flex h-[200px] flex-col items-center justify-center">
                <p className="text-muted-foreground">No upcoming exams</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedExams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>{exam.title}</CardTitle>
                  <CardDescription>{exam.subject}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline">{exam.status}</Badge>
                  <span className="text-lg font-bold">{exam.grade}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{exam.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {exam.questions} questions • {exam.duration}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Score: </span>
                      <span>{exam.score}</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-end">
                    <Button asChild>
                      <Link href={`/my-exams/${exam.id}/results`}>View Results</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {completedExams.length === 0 && (
            <Card>
              <CardContent className="flex h-[200px] flex-col items-center justify-center">
                <p className="text-muted-foreground">No completed exams</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

