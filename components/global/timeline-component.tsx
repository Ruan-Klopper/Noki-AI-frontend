"use client"

import { useState } from "react"
import { Clock } from "lucide-react"

interface TimelineEvent {
  id: string
  title: string
  startTime: string
  endTime: string
  participants: string[]
  color: string
}

interface TimelineComponentProps {
  events: TimelineEvent[]
  date: string
}

export function TimelineComponent({ events, date }: TimelineComponentProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

  const getEventPosition = (startTime: string, endTime: string) => {
    const startHour = Number.parseInt(startTime.split(":")[0])
    const startMinute = Number.parseInt(startTime.split(":")[1])
    const endHour = Number.parseInt(endTime.split(":")[0])
    const endMinute = Number.parseInt(endTime.split(":")[1])

    const startPosition = (((startHour - 9) * 60 + startMinute) / 60) * 12.5 // 12.5% per hour
    const duration = (((endHour - startHour) * 60 + (endMinute - startMinute)) / 60) * 12.5

    return { left: `${startPosition}%`, width: `${duration}%` }
  }

  return (
    null
  )
}
