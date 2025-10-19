"use client"

import type React from "react"

import { useState } from "react"
import { X, Sparkles } from "lucide-react"
import { NokiButton } from "./noki-button"

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (task: string) => void
}

export function QuickAddModal({ isOpen, onClose, onAddTask }: QuickAddModalProps) {
  const [taskInput, setTaskInput] = useState("")
  const [aiSuggestions] = useState([
    "Break down Research Methods Assignment into smaller tasks",
    "Review lecture notes for upcoming quiz",
    "Schedule study session for midterm exam",
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskInput.trim()) {
      onAddTask(taskInput.trim())
      setTaskInput("")
      onClose()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onAddTask(suggestion)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-[20px] shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-muted">
          <h3 className="font-heading font-semibold text-foreground">Add New Task</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">What do you need to do?</label>
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Enter your task..."
                className="w-full p-3 rounded-lg border border-muted bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <NokiButton type="submit" variant="positive" size="sm">
                Add Task
              </NokiButton>
              <NokiButton type="button" variant="negative" size="sm" onClick={onClose}>
                Cancel
              </NokiButton>
            </div>
          </form>

          <div className="border-t border-muted pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">AI Suggestions</span>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
