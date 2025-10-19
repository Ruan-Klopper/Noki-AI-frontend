"use client"
import { ChevronLeft, ChevronRight, Circle, CheckCircle2, BookOpen, FolderKanban } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Image from "next/image"
import { ManageProjectsModal } from "./manage-projects-modal"

interface Todo {
  id: string
  title: string
  project: string
  time: string
  day: string
  completed?: boolean
  type?: "todo" | "assignment" | "task"
  parentName?: string
  assignmentTitle?: string
}

interface TodosSidenavProps {
  isCollapsed: boolean
  onToggle: () => void
}

const projectColors: Record<string, string> = {
  "Computer Science 101": "border-l-blue-500",
  Mathematics: "border-l-purple-500",
  "Group Project": "border-l-green-500",
  "English Literature": "border-l-pink-500",
  "Physics Lab": "border-l-cyan-500",
  Biology: "border-l-emerald-500",
  Marketing: "border-l-orange-500",
  History: "border-l-amber-500",
  "Interactive Development 300": "border-l-blue-500",
  "Photography 300": "border-l-cyan-500",
  "Visual Culture 300": "border-l-orange-500",
  "Portfolio Website Redesign": "border-l-blue-500",
  "Mobile App Development": "border-l-cyan-500",
  "Photography Portfolio": "border-l-orange-500",
}

const getProjectColor = (project: string): string => {
  return projectColors[project] || "border-l-noki-primary"
}

const todosByDay = [
  {
    day: "Today",
    date: "Monday, Jan 10",
    todos: [
      {
        id: "1",
        title: "Complete assignment",
        project: "Computer Science 101",
        time: "2:00 PM",
        completed: false,
        type: "todo" as const,
      },
      {
        id: "2",
        title: "Study for quiz",
        project: "Mathematics",
        time: "4:30 PM",
        completed: false,
        type: "todo" as const,
      },
      {
        id: "a1",
        title: "Research competitor apps",
        project: "Interactive Development 300",
        time: "5:00 PM",
        completed: true,
        type: "assignment" as const,
        parentName: "Interactive Development 300",
        assignmentTitle: "Start planning mobile app",
      },
      {
        id: "3",
        title: "Team meeting",
        project: "Group Project",
        time: "6:00 PM",
        completed: true,
        type: "todo" as const,
      },
      {
        id: "t1",
        title: "Create mood board",
        project: "Portfolio Website Redesign",
        time: "7:00 PM",
        completed: true,
        type: "task" as const,
        parentName: "Portfolio Website Redesign",
        assignmentTitle: "Design new homepage layout",
      },
    ],
  },
  {
    day: "Tomorrow",
    date: "Tuesday, Jan 11",
    todos: [
      {
        id: "4",
        title: "Submit essay",
        project: "English Literature",
        time: "11:59 PM",
        completed: false,
        type: "todo" as const,
      },
      {
        id: "a2",
        title: "Select images from shoots",
        project: "Photography 300",
        time: "2:00 PM",
        completed: false,
        type: "assignment" as const,
        parentName: "Photography 300",
        assignmentTitle: "40 images for commercial portfolio",
      },
      {
        id: "5",
        title: "Lab report",
        project: "Physics Lab",
        time: "3:00 PM",
        completed: false,
        type: "todo" as const,
      },
      {
        id: "t2",
        title: "Sketch layout options",
        project: "Portfolio Website Redesign",
        time: "4:00 PM",
        completed: false,
        type: "task" as const,
        parentName: "Portfolio Website Redesign",
        assignmentTitle: "Design new homepage layout",
      },
    ],
  },
  {
    day: "This Week",
    date: "Jan 12 - Jan 16",
    todos: [
      {
        id: "6",
        title: "Midterm exam",
        project: "Biology",
        time: "Wed 10:00 AM",
        completed: false,
        type: "todo" as const,
      },
      {
        id: "a3",
        title: "Research visual culture theory",
        project: "Visual Culture 300",
        time: "Wed 2:00 PM",
        completed: false,
        type: "assignment" as const,
        parentName: "Visual Culture 300",
        assignmentTitle: "Visual Culture Essay",
      },
      {
        id: "7",
        title: "Project presentation",
        project: "Marketing",
        time: "Thu 2:00 PM",
        completed: false,
        type: "todo" as const,
      },
      {
        id: "t3",
        title: "Sketch user flows",
        project: "Mobile App Development",
        time: "Thu 4:00 PM",
        completed: true,
        type: "task" as const,
        parentName: "Mobile App Development",
        assignmentTitle: "Create wireframes",
      },
      {
        id: "8",
        title: "Reading assignment",
        project: "History",
        time: "Fri 5:00 PM",
        completed: false,
        type: "todo" as const,
      },
      {
        id: "a4",
        title: "Update portfolio website",
        project: "Interactive Development 300",
        time: "Fri 6:00 PM",
        completed: false,
        type: "assignment" as const,
        parentName: "Interactive Development 300",
        assignmentTitle: "Portfolio Review",
      },
    ],
  },
]

export default function TodosSidenav({ isCollapsed, onToggle }: TodosSidenavProps) {
  const [todos, setTodos] = useState(todosByDay)
  const [activeFilter, setActiveFilter] = useState<"today" | "week" | "month">("today")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleTodoComplete = (dayIndex: number, todoId: string) => {
    setTodos((prev) =>
      prev.map((group, idx) =>
        idx === dayIndex
          ? {
              ...group,
              todos: group.todos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)),
            }
          : group,
      ),
    )
  }

  const todayTodos = todos[0]?.todos || []
  const completedToday = todayTodos.filter((todo) => todo.completed).length
  const totalToday = todayTodos.length
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0

  const filteredTodos = todos.filter((group) => {
    if (activeFilter === "today") return group.day === "Today"
    if (activeFilter === "week") return group.day === "Today" || group.day === "Tomorrow" || group.day === "This Week"
    return true
  })

  return (
    <>
      {/* Desktop Sidenav */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-card border-l border-border transition-all duration-300 ease-in-out h-screen fixed right-0 top-0 z-30",
          isCollapsed ? "w-16" : "w-80",
        )}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-card border-b border-border z-10">
          <div className={cn("relative overflow-hidden", isCollapsed ? "h-16" : "h-24")}>
            <Image
              src="/placeholder.svg?height=96&width=320"
              alt="Noki Character"
              width={320}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          {!isCollapsed && (
            <div className="px-4 py-4">
              <h2 className="font-poppins font-bold text-xl text-noki-primary">Todos</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Your upcoming tasks</p>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-roboto">Today's Progress</span>
                  <span className="text-foreground font-medium font-roboto">
                    {completedToday}/{totalToday}
                  </span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-noki-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-noki-primary font-medium font-roboto text-right">
                  {Math.round(progressPercentage)}% complete
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setActiveFilter("today")}
                  className={cn(
                    "flex-1 px-3 py-1.5 rounded-lg text-xs font-medium font-roboto transition-all",
                    activeFilter === "today"
                      ? "bg-noki-primary text-white shadow-sm"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                  )}
                >
                  Today
                </button>
                <button
                  onClick={() => setActiveFilter("week")}
                  className={cn(
                    "flex-1 px-3 py-1.5 rounded-lg text-xs font-medium font-roboto transition-all",
                    activeFilter === "week"
                      ? "bg-noki-primary text-white shadow-sm"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                  )}
                >
                  This Week
                </button>
                <button
                  onClick={() => setActiveFilter("month")}
                  className={cn(
                    "flex-1 px-3 py-1.5 rounded-lg text-xs font-medium font-roboto transition-all",
                    activeFilter === "month"
                      ? "bg-noki-primary text-white shadow-sm"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                  )}
                >
                  This Month
                </button>
              </div>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className="absolute top-4 -left-3 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-colors shadow-sm"
            aria-label="Toggle todos sidebar"
          >
            {isCollapsed ? (
              <ChevronLeft className="w-4 h-4 text-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-foreground" />
            )}
          </button>
        </div>

        {/* Scrollable Todos Content */}
        <div className="flex-1 overflow-y-auto">
          {!isCollapsed ? (
            <div className="p-3 space-y-5">
              {filteredTodos.map((group, groupIndex) => (
                <div key={group.day} className="space-y-2">
                  <div className="sticky top-0 bg-card px-2 py-1.5 z-10 border-b border-border/50">
                    <h3 className="font-poppins font-semibold text-sm text-foreground">{group.day}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{group.date}</p>
                  </div>

                  <div className="space-y-1.5">
                    {group.todos.map((todo) => (
                      <div
                        key={todo.id}
                        onClick={() => toggleTodoComplete(groupIndex, todo.id)}
                        className={cn(
                          "group p-2 rounded-lg border border-l-4 transition-all duration-200 cursor-pointer",
                          getProjectColor(todo.project),
                          todo.completed
                            ? "bg-secondary border-border opacity-60"
                            : "bg-card border-border hover:border-noki-primary hover:shadow-sm",
                          todo.type === "assignment" && !todo.completed && "bg-blue-500/5",
                          todo.type === "task" && !todo.completed && "bg-cyan-500/5",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {todo.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-noki-primary flex-shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground group-hover:text-noki-primary transition-colors flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            {(todo.type === "assignment" || todo.type === "task") && (
                              <div className="flex items-center gap-1.5 mb-1">
                                {todo.type === "assignment" ? (
                                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/20 rounded text-[9px] font-medium text-blue-600">
                                    <BookOpen className="w-2.5 h-2.5" />
                                    <span className="pt-0.5">ASSIGNMENT</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-cyan-500/20 rounded text-[9px] font-medium text-cyan-600">
                                    <FolderKanban className="w-2.5 h-2.5" />
                                    <span className="pt-0.5">TASK</span>
                                  </div>
                                )}
                              </div>
                            )}
                            <h4
                              className={cn(
                                "font-roboto font-medium text-xs line-clamp-2 transition-colors",
                                todo.completed
                                  ? "text-muted-foreground line-through"
                                  : "text-foreground group-hover:text-noki-primary",
                              )}
                            >
                              {todo.title}
                            </h4>
                            {(todo.type === "assignment" || todo.type === "task") &&
                              todo.parentName &&
                              todo.assignmentTitle && (
                                <p className="text-[9px] text-muted-foreground mt-1 line-clamp-1 font-roboto">
                                  <span className="font-medium">{todo.parentName}</span>
                                  <span className="mx-1">→</span>
                                  <span>{todo.assignmentTitle}</span>
                                </p>
                              )}
                            {todo.type === "todo" && (
                              <p className="text-[10px] text-muted-foreground mt-1 truncate font-roboto">
                                {todo.project}
                              </p>
                            )}
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-1 h-1 rounded-full bg-noki-tertiary" />
                              <p className="text-[10px] text-foreground font-medium font-roboto">{todo.time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div
                className="group/create relative h-16 flex items-center justify-center cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="absolute inset-0 opacity-0 group-hover/create:opacity-100 transition-opacity duration-200">
                  <div className="h-full flex items-center justify-center">
                    <div className="px-4 py-2 rounded-lg border-2 border-dashed border-noki-primary/30 bg-noki-primary/5 hover:bg-noki-primary/10 hover:border-noki-primary/50 transition-all duration-200">
                      <p className="text-xs font-medium text-noki-primary font-roboto">+ Create another task/todo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2 space-y-6 mt-4">
              {todos.map((group) => (
                <div key={group.day} className="space-y-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground mx-auto" />
                  {group.todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={cn(
                        "w-2 h-2 rounded-full mx-auto hover:scale-125 transition-transform cursor-pointer",
                        todo.completed ? "bg-muted-foreground" : "bg-noki-primary",
                      )}
                      title={todo.title}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={onToggle} aria-label="Close todos sidebar" />
      )}

      {/* Mobile Sidenav */}
      <aside
        className={cn(
          "md:hidden fixed right-0 top-0 h-screen w-80 bg-card border-l border-border z-50 transition-transform duration-300 ease-in-out flex flex-col",
          isCollapsed ? "translate-x-full" : "translate-x-0",
        )}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-card border-b border-border z-10">
          <div className="relative h-24 overflow-hidden">
            <Image
              src="/placeholder.svg?height=96&width=320"
              alt="Noki Character"
              width={320}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title Section */}
          <div className="px-4 py-4">
            <h2 className="font-poppins font-bold text-xl text-noki-primary">Todos</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Your upcoming tasks</p>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-roboto">Today's Progress</span>
                <span className="text-foreground font-medium font-roboto">
                  {completedToday}/{totalToday}
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-noki-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-noki-primary font-medium font-roboto text-right">
                {Math.round(progressPercentage)}% complete
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setActiveFilter("today")}
                className={cn(
                  "flex-1 px-3 py-1.5 rounded-lg text-xs font-medium font-roboto transition-all",
                  activeFilter === "today"
                    ? "bg-noki-primary text-white shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                )}
              >
                Today
              </button>
              <button
                onClick={() => setActiveFilter("week")}
                className={cn(
                  "flex-1 px-3 py-1.5 rounded-lg text-xs font-medium font-roboto transition-all",
                  activeFilter === "week"
                    ? "bg-noki-primary text-white shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                )}
              >
                This Week
              </button>
              <button
                onClick={() => setActiveFilter("month")}
                className={cn(
                  "flex-1 px-3 py-1.5 rounded-lg text-xs font-medium font-roboto transition-all",
                  activeFilter === "month"
                    ? "bg-noki-primary text-white shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                )}
              >
                This Month
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onToggle}
            className="absolute top-4 right-4 w-8 h-8 bg-card rounded-full flex items-center justify-center hover:bg-secondary transition-colors shadow-sm"
            aria-label="Close todos sidebar"
          >
            <ChevronRight className="w-5 h-5 text-noki-primary" />
          </button>
        </div>

        {/* Scrollable Todos Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-5">
            {filteredTodos.map((group, groupIndex) => (
              <div key={group.day} className="space-y-2">
                {/* Day Header */}
                <div className="sticky top-0 bg-card px-2 py-1.5 z-10 border-b border-border/50">
                  <h3 className="font-poppins font-semibold text-sm text-foreground">{group.day}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{group.date}</p>
                </div>

                {/* Todos */}
                <div className="space-y-1.5">
                  {group.todos.map((todo) => (
                    <div
                      key={todo.id}
                      onClick={() => toggleTodoComplete(groupIndex, todo.id)}
                      className={cn(
                        "group p-2 rounded-lg border border-l-4 transition-all duration-200 cursor-pointer",
                        getProjectColor(todo.project),
                        todo.completed
                          ? "bg-secondary border-border opacity-60"
                          : "bg-card border-border hover:border-noki-primary hover:shadow-sm",
                        todo.type === "assignment" && !todo.completed && "bg-blue-500/5",
                        todo.type === "task" && !todo.completed && "bg-cyan-500/5",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {todo.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-noki-primary flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground group-hover:text-noki-primary transition-colors flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          {(todo.type === "assignment" || todo.type === "task") && (
                            <div className="flex items-center gap-1.5 mb-1">
                              {todo.type === "assignment" ? (
                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/20 rounded text-[9px] font-medium text-blue-600">
                                  <BookOpen className="w-2.5 h-2.5" />
                                  <span>ASSIGNMENT</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-cyan-500/20 rounded text-[9px] font-medium text-cyan-600">
                                  <FolderKanban className="w-2.5 h-2.5" />
                                  <span>TASK</span>
                                </div>
                              )}
                            </div>
                          )}
                          <h4
                            className={cn(
                              "font-roboto font-medium text-xs line-clamp-2 transition-colors",
                              todo.completed
                                ? "text-muted-foreground line-through"
                                : "text-foreground group-hover:text-noki-primary",
                            )}
                          >
                            {todo.title}
                          </h4>
                          {(todo.type === "assignment" || todo.type === "task") &&
                            todo.parentName &&
                            todo.assignmentTitle && (
                              <p className="text-[9px] text-muted-foreground mt-1 line-clamp-1 font-roboto">
                                <span className="font-medium">{todo.parentName}</span>
                                <span className="mx-1">→</span>
                                <span>{todo.assignmentTitle}</span>
                              </p>
                            )}
                          {todo.type === "todo" && (
                            <p className="text-[10px] text-muted-foreground mt-1 truncate font-roboto">
                              {todo.project}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-1 h-1 rounded-full bg-noki-tertiary" />
                            <p className="text-[10px] text-foreground font-medium font-roboto">{todo.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div
              className="group/create relative h-16 flex items-center justify-center cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="absolute inset-0 opacity-0 group-hover/create:opacity-100 transition-opacity duration-200">
                <div className="h-full flex items-center justify-center">
                  <div className="px-4 py-2 rounded-lg border-2 border-dashed border-noki-primary/30 bg-noki-primary/5 hover:bg-noki-primary/10 hover:border-noki-primary/50 transition-all duration-200">
                    <p className="text-xs font-medium text-noki-primary font-roboto">+ Create another task/todo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ManageProjectsModal Component */}
      <ManageProjectsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
