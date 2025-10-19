"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface TaskItemProps {
  id: string
  title: string
  completed?: boolean
  onToggle?: (id: string) => void
}

export function TaskItem({ id, title, completed = false, onToggle }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(completed)

  const handleToggle = () => {
    const newState = !isCompleted
    setIsCompleted(newState)
    onToggle?.(id)
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          isCompleted ? "bg-primary border-primary text-secondary" : "border-muted-foreground hover:border-primary"
        }`}
      >
        {isCompleted && <Check size={12} />}
      </button>
      <span className={`text-sm ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
        {title}
      </span>
    </div>
  )
}
