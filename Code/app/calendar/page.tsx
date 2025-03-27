"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Mock data for calendar events
const mockEvents = [
  {
    id: "1",
    title: "Data Structures Final",
    date: "2025-03-28T10:00:00",
    endDate: "2025-03-28T12:00:00",
    type: "exam",
    status: "scheduled",
  },
  {
    id: "2",
    title: "Advanced Algorithms Quiz",
    date: "2025-03-26T09:00:00",
    endDate: "2025-03-26T10:00:00",
    type: "quiz",
    status: "scheduled",
  },
  {
    id: "3",
    title: "Machine Learning Project Deadline",
    date: "2025-03-30T23:59:00",
    endDate: "2025-03-30T23:59:00",
    type: "deadline",
    status: "pending",
  },
  {
    id: "4",
    title: "Software Engineering Exam",
    date: "2025-04-02T14:00:00",
    endDate: "2025-04-02T16:00:00",
    type: "exam",
    status: "scheduled",
  },
  {
    id: "5",
    title: "Computer Networks Lab",
    date: "2025-03-27T13:00:00",
    endDate: "2025-03-27T15:00:00",
    type: "lab",
    status: "scheduled",
  },
]

export default function CalendarPage() {
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState(mockEvents)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)

  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1))
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1))

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsAddEventOpen(true)
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const title = formData.get("title") as string
    const type = formData.get("type") as string
    const time = formData.get("time") as string
    const duration = formData.get("duration") as string

    if (!selectedDate || !title || !type || !time) return

    const [hours, minutes] = time.split(":").map(Number)
    const eventDate = new Date(selectedDate)
    eventDate.setHours(hours, minutes)

    const endDate = new Date(eventDate)
    endDate.setMinutes(endDate.getMinutes() + Number.parseInt(duration || "60"))

    const newEvent = {
      id: (events.length + 1).toString(),
      title,
      date: eventDate.toISOString(),
      endDate: endDate.toISOString(),
      type,
      status: "scheduled",
    }

    setEvents([...events, newEvent])
    setIsAddEventOpen(false)

    toast({
      title: "Event added",
      description: `${title} has been added to your calendar`,
    })
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.date)
      return isSameDay(eventDate, date)
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "exam":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "quiz":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "deadline":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "lab":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    }
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
                  <BreadcrumbPage>Calendar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-3xl font-bold tracking-tight mt-2">Calendar</h2>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              {format(startDate, "MMMM d")} - {format(addDays(startDate, 6), "MMMM d, yyyy")}
            </div>
            <Button variant="outline" size="icon" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button onClick={() => handleDateClick(new Date())}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card className={`h-full ${isSameDay(day, new Date()) ? "border-primary" : ""}`}>
                <CardHeader className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <CardTitle className="text-sm">{format(day, "EEE")}</CardTitle>
                      <CardDescription
                        className={`text-lg font-bold ${isSameDay(day, new Date()) ? "text-primary" : ""}`}
                      >
                        {format(day, "d")}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDateClick(day)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {getEventsForDate(day).map((event) => (
                      <motion.div key={event.id} whileHover={{ scale: 1.02 }} className="rounded-md border p-2 text-xs">
                        <div className="flex items-center justify-between">
                          <Badge className={`${getEventTypeColor(event.type)}`}>{event.type}</Badge>
                          <span className="text-muted-foreground">{format(parseISO(event.date), "h:mm a")}</span>
                        </div>
                        <div className="mt-1 font-medium">{event.title}</div>
                      </motion.div>
                    ))}

                    {getEventsForDate(day).length === 0 && (
                      <div className="flex h-16 items-center justify-center text-xs text-muted-foreground">
                        No events
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your scheduled exams, quizzes, and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter((event) => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          event.type === "exam"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : event.type === "quiz"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : event.type === "deadline"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        }`}
                      >
                        {event.type.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(event.date), "EEEE, MMMM d, yyyy")} at{" "}
                          {format(parseISO(event.date), "h:mm a")}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getEventTypeColor(event.type)}`}>{event.type}</Badge>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
              <DialogDescription>
                Create a new event for {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "selected date"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEvent}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" name="title" placeholder="Enter event title" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select name="type" defaultValue="exam" required>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" name="time" type="time" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" name="duration" type="number" defaultValue="60" min="15" step="15" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Event</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  )
}

