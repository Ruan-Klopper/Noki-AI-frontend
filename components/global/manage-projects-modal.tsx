"use client"

import { useState, useEffect } from "react"
import {
  X,
  Plus,
  FolderKanban,
  BookOpen,
  ListTodo,
  CalendarIcon,
  Clock,
  Edit2,
  Trash2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import { NokiButton } from "./noki-button"

interface ManageProjectsModalProps {
  isOpen: boolean
  onClose: () => void
  editingItem?: any
  editingType?: "project" | "course" | null
}

type ViewMode =
  | "overview"
  | "add-project"
  | "add-task"
  | "add-todo"
  | "manage-projects"
  | "manage-canvas"
  | "manage-tasks"
  | "manage-todos"
type ProjectType = "personal" | "canvas"

export function ManageProjectsModal({ isOpen, onClose, editingItem, editingType }: ManageProjectsModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("overview")
  const [projectType, setProjectType] = useState<ProjectType>("personal")
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [selectedTask, setSelectedTask] = useState<string>("")
  const [editingId, setEditingId] = useState<string>("")
  const [todoFilter, setTodoFilter] = useState<"all" | "personal" | "canvas">("all")

  // Form states
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectColor, setProjectColor] = useState("bg-noki-primary")
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDueDate, setTaskDueDate] = useState("")
  const [taskDueTime, setTaskDueTime] = useState("")
  const [todoTitle, setTodoTitle] = useState("")
  const [todoDueDate, setTodoDueDate] = useState("")
  const [todoDueTime, setTodoDueTime] = useState("")

  // Sample data
  const personalProjects = [
    {
      id: "1",
      name: "Portfolio Website Redesign",
      description: "Redesign my portfolio with modern UI",
      color: "bg-noki-primary",
    },
    { id: "2", name: "Mobile App Development", description: "Build a productivity app", color: "bg-noki-tertiary" },
    { id: "3", name: "Photography Portfolio", description: "Showcase my best work", color: "bg-orange-200" },
  ]

  const canvasCourses = [
    { id: "1", name: "Interactive Development 300", code: "DV300", color: "bg-noki-primary" },
    { id: "2", name: "Photography 300", code: "PH300", color: "bg-noki-tertiary" },
    { id: "3", name: "Visual Culture 300", code: "VC300", color: "bg-orange-200" },
  ]

  const tasks = [
    { id: "t1", title: "Design new homepage layout", projectId: "1", dueDate: "2025-02-15", dueTime: "14:00" },
    { id: "t2", title: "Implement dark mode", projectId: "1", dueDate: "2025-02-20", dueTime: "16:00" },
    { id: "t3", title: "Setup project structure", projectId: "2", dueDate: "2025-02-18", dueTime: "10:00" },
  ]

  const assignments = [
    { id: "a1", title: "Start planning mobile app", courseId: "1" },
    { id: "a2", title: "Portfolio Review", courseId: "1" },
  ]

  const todos = [
    {
      id: "td1",
      title: "Create wireframes",
      taskId: "t1",
      projectId: "1",
      type: "personal",
      dueDate: "2025-02-14",
      dueTime: "12:00",
    },
    {
      id: "td2",
      title: "Research color schemes",
      taskId: "t1",
      projectId: "1",
      type: "personal",
      dueDate: "2025-02-14",
      dueTime: "15:00",
    },
    {
      id: "td3",
      title: "Write project proposal",
      taskId: "a1",
      courseId: "1",
      type: "canvas",
      dueDate: "2025-02-16",
      dueTime: "09:00",
    },
  ]

  const colorOptions = [
    "bg-noki-primary",
    "bg-noki-tertiary",
    "bg-orange-200",
    "bg-purple-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-pink-400",
    "bg-yellow-400",
    "bg-red-400",
    "bg-teal-400",
    "bg-cyan-400",
    "bg-indigo-400",
    "bg-violet-400",
    "bg-fuchsia-400",
    "bg-rose-400",
    "bg-emerald-400",
    "bg-lime-400",
    "bg-amber-400",
    "bg-sky-400",
    "bg-purple-500",
    "bg-pink-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
  ]

  useEffect(() => {
    if (isOpen && editingItem && editingType) {
      if (editingType === "project") {
        setViewMode("manage-projects")
        setEditingId(editingItem.id)
        setProjectName(editingItem.name)
        setProjectDescription(editingItem.description || "")
        setProjectColor(editingItem.color)
      } else if (editingType === "course") {
        setViewMode("manage-canvas")
        setEditingId(editingItem.id)
        setProjectName(editingItem.name)
        setProjectColor(editingItem.color)
      }
    }
  }, [isOpen, editingItem, editingType])

  const handleAddProject = () => {
    console.log("[v0] Adding project:", { projectName, projectDescription, projectColor })
    resetForm()
    setViewMode("overview")
  }

  const handleAddTask = () => {
    console.log("[v0] Adding task:", { taskTitle, taskDueDate, taskDueTime, selectedProject })
    resetForm()
    setViewMode("overview")
  }

  const handleAddTodo = () => {
    console.log("[v0] Adding todo:", { todoTitle, todoDueDate, todoDueTime, selectedProject, selectedTask })
    resetForm()
    setViewMode("overview")
  }

  const handleEditProject = (project: any) => {
    setEditingId(project.id)
    setProjectName(project.name)
    setProjectDescription(project.description || "")
    setProjectColor(project.color)
  }

  const handleUpdateProject = () => {
    console.log("[v0] Updating project:", { editingId, projectName, projectDescription, projectColor })
    resetForm()
    setEditingId("")
  }

  const handleDeleteProject = (id: string) => {
    console.log("[v0] Deleting project:", id)
  }

  const handleEditCanvas = (course: any) => {
    setEditingId(course.id)
    setProjectName(course.name)
    setProjectColor(course.color)
  }

  const handleUpdateCanvas = () => {
    console.log("[v0] Updating canvas course:", { editingId, projectName, projectColor })
    resetForm()
    setEditingId("")
  }

  const handleEditTask = (task: any) => {
    setEditingId(task.id)
    setTaskTitle(task.title)
    setTaskDueDate(task.dueDate)
    setTaskDueTime(task.dueTime)
  }

  const handleUpdateTask = () => {
    console.log("[v0] Updating task:", { editingId, taskTitle, taskDueDate, taskDueTime })
    resetForm()
    setEditingId("")
  }

  const handleDeleteTask = (id: string) => {
    console.log("[v0] Deleting task:", id)
  }

  const handleEditTodo = (todo: any) => {
    setEditingId(todo.id)
    setTodoTitle(todo.title)
    setTodoDueDate(todo.dueDate)
    setTodoDueTime(todo.dueTime)
  }

  const handleUpdateTodo = () => {
    console.log("[v0] Updating todo:", { editingId, todoTitle, todoDueDate, todoDueTime })
    resetForm()
    setEditingId("")
  }

  const handleDeleteTodo = (id: string) => {
    console.log("[v0] Deleting todo:", id)
  }

  const resetForm = () => {
    setProjectName("")
    setProjectDescription("")
    setProjectColor("bg-noki-primary")
    setTaskTitle("")
    setTaskDueDate("")
    setTaskDueTime("")
    setTodoTitle("")
    setTodoDueDate("")
    setTodoDueTime("")
    setSelectedProject("")
    setSelectedTask("")
  }

  const handleClose = () => {
    resetForm()
    setViewMode("overview")
    setEditingId("")
    onClose()
  }

  const handleBack = () => {
    if (viewMode === "manage-tasks") {
      setViewMode("manage-projects")
      setSelectedProject("")
    } else {
      setViewMode("overview")
    }
  }

  if (!isOpen) return null

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => setViewMode("manage-projects")}
          className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10 rounded-xl border border-purple-500/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Edit2 className="text-purple-400" size={20} />
            </div>
            <div className="text-left">
              <div className="font-poppins font-semibold text-foreground text-sm">Manage Projects</div>
              <div className="text-xs text-muted-foreground">Edit personal projects</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setViewMode("manage-canvas")}
          className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10 rounded-xl border border-blue-500/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="text-blue-400" size={20} />
            </div>
            <div className="text-left">
              <div className="font-poppins font-semibold text-foreground text-sm">Manage Canvas</div>
              <div className="text-xs text-muted-foreground">Edit course settings</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setViewMode("manage-todos")}
          className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 hover:from-green-500/20 hover:to-green-500/10 rounded-xl border border-green-500/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <ListTodo className="text-green-400" size={20} />
            </div>
            <div className="text-left">
              <div className="font-poppins font-semibold text-foreground text-sm">Manage Todos</div>
              <div className="text-xs text-muted-foreground">Edit all todos</div>
            </div>
          </div>
        </button>
      </div>

      <div className="h-px bg-border my-4" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setViewMode("add-project")}
          className="p-6 bg-gradient-to-br from-noki-primary/10 to-noki-primary/5 hover:from-noki-primary/20 hover:to-noki-primary/10 rounded-2xl border-2 border-dashed border-noki-primary/30 transition-all group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-noki-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="text-noki-primary" size={24} />
            </div>
            <div className="text-center">
              <div className="font-poppins font-semibold text-foreground">New Project</div>
              <div className="text-xs text-muted-foreground mt-1">Create personal project</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setViewMode("add-task")}
          className="p-6 bg-gradient-to-br from-noki-tertiary/10 to-noki-tertiary/5 hover:from-noki-tertiary/20 hover:to-noki-tertiary/10 rounded-2xl border-2 border-dashed border-noki-tertiary/30 transition-all group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-noki-tertiary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ListTodo className="text-noki-tertiary" size={24} />
            </div>
            <div className="text-center">
              <div className="font-poppins font-semibold text-foreground">New Task</div>
              <div className="text-xs text-muted-foreground mt-1">Add task to project</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setViewMode("add-todo")}
          className="p-6 bg-gradient-to-br from-orange-200/10 to-orange-200/5 hover:from-orange-200/20 hover:to-orange-200/10 rounded-2xl border-2 border-dashed border-orange-200/30 transition-all group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-orange-200/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="text-orange-600" size={24} />
            </div>
            <div className="text-center">
              <div className="font-poppins font-semibold text-foreground">New Todo</div>
              <div className="text-xs text-muted-foreground mt-1">Add todo item</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )

  const renderManageProjects = () => (
    <div className="space-y-4 max-h-[500px] overflow-y-auto">
      {personalProjects.map((project) => (
        <div
          key={project.id}
          className="border border-border rounded-xl p-4 hover:border-noki-primary/50 transition-colors"
        >
          {editingId === project.id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
              />
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Project description..."
                className="w-full p-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary resize-none"
                rows={2}
              />
              <div className="grid grid-cols-6 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setProjectColor(color)}
                    className={`h-8 rounded-lg ${color} transition-all ${
                      projectColor === color ? "ring-2 ring-foreground/20 scale-105" : "hover:scale-105"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <NokiButton onClick={handleUpdateProject} variant="positive" size="sm">
                  Save
                </NokiButton>
                <NokiButton onClick={() => setEditingId("")} variant="negative" size="sm">
                  Cancel
                </NokiButton>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-12 h-12 ${project.color} rounded-lg flex-shrink-0`} />
                <div className="flex-1">
                  <h4 className="font-poppins font-semibold text-foreground">{project.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  <button
                    onClick={() => {
                      setSelectedProject(project.id)
                      setViewMode("manage-tasks")
                    }}
                    className="text-xs text-noki-primary hover:text-noki-primary/80 mt-2 flex items-center gap-1"
                  >
                    Manage Tasks <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProject(project)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Edit2 size={16} className="text-muted-foreground hover:text-foreground" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <NokiButton onClick={() => setViewMode("overview")} variant="neutral" size="sm" className="w-full mt-4">
        Back to Overview
      </NokiButton>
    </div>
  )

  const renderManageCanvas = () => (
    <div className="space-y-4 max-h-[500px] overflow-y-auto">
      {canvasCourses.map((course) => (
        <div
          key={course.id}
          className="border border-border rounded-xl p-4 hover:border-noki-primary/50 transition-colors"
        >
          {editingId === course.id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
              />
              <div className="grid grid-cols-6 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setProjectColor(color)}
                    className={`h-8 rounded-lg ${color} transition-all ${
                      projectColor === color ? "ring-2 ring-foreground/20 scale-105" : "hover:scale-105"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <NokiButton onClick={handleUpdateCanvas} variant="positive" size="sm">
                  Save
                </NokiButton>
                <NokiButton onClick={() => setEditingId("")} variant="negative" size="sm">
                  Cancel
                </NokiButton>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${course.color} rounded-lg flex-shrink-0`} />
                <div>
                  <h4 className="font-poppins font-semibold text-foreground">{course.name}</h4>
                  <p className="text-sm text-muted-foreground">{course.code}</p>
                </div>
              </div>
              <button
                onClick={() => handleEditCanvas(course)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Edit2 size={16} className="text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          )}
        </div>
      ))}
      <NokiButton onClick={() => setViewMode("overview")} variant="neutral" size="sm" className="w-full mt-4">
        Back to Overview
      </NokiButton>
    </div>
  )

  const renderManageTasks = () => {
    const projectTasks = tasks.filter((task) => task.projectId === selectedProject)
    const project = personalProjects.find((p) => p.id === selectedProject)

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className={`w-10 h-10 ${project?.color} rounded-lg`} />
          <div>
            <h4 className="font-poppins font-semibold text-foreground text-sm">{project?.name}</h4>
            <p className="text-xs text-muted-foreground">Managing tasks</p>
          </div>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {projectTasks.map((task) => (
            <div
              key={task.id}
              className="border border-border rounded-lg p-3 hover:border-noki-primary/50 transition-colors"
            >
              {editingId === task.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
                    />
                    <input
                      type="time"
                      value={taskDueTime}
                      onChange={(e) => setTaskDueTime(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
                    />
                  </div>
                  <div className="flex gap-2">
                    <NokiButton onClick={handleUpdateTask} variant="positive" size="sm">
                      Save
                    </NokiButton>
                    <NokiButton onClick={() => setEditingId("")} variant="negative" size="sm">
                      Cancel
                    </NokiButton>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground">{task.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {task.dueDate} at {task.dueTime}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Edit2 size={14} className="text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <NokiButton onClick={() => setViewMode("manage-projects")} variant="neutral" size="sm" className="w-full">
          Back to Projects
        </NokiButton>
      </div>
    )
  }

  const renderManageTodos = () => {
    const filteredTodos = todos.filter((todo) => {
      if (todoFilter === "all") return true
      return todo.type === todoFilter
    })

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setTodoFilter("all")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              todoFilter === "all" ? "bg-noki-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Todos
          </button>
          <button
            onClick={() => setTodoFilter("personal")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              todoFilter === "personal"
                ? "bg-noki-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Personal
          </button>
          <button
            onClick={() => setTodoFilter("canvas")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              todoFilter === "canvas"
                ? "bg-noki-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Canvas
          </button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="border border-border rounded-lg p-3 hover:border-noki-primary/50 transition-colors"
            >
              {editingId === todo.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={todoDueDate}
                      onChange={(e) => setTodoDueDate(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
                    />
                    <input
                      type="time"
                      value={todoDueTime}
                      onChange={(e) => setTodoDueTime(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
                    />
                  </div>
                  <div className="flex gap-2">
                    <NokiButton onClick={handleUpdateTodo} variant="positive" size="sm">
                      Save
                    </NokiButton>
                    <NokiButton onClick={() => setEditingId("")} variant="negative" size="sm">
                      Cancel
                    </NokiButton>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-foreground">{todo.title}</h5>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          todo.type === "personal"
                            ? "bg-noki-primary/20 text-noki-primary"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {todo.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {todo.dueDate} at {todo.dueTime}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTodo(todo)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Edit2 size={14} className="text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <NokiButton onClick={() => setViewMode("overview")} variant="neutral" size="sm" className="w-full">
          Back to Overview
        </NokiButton>
      </div>
    )
  }

  const renderAddProject = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name..."
          className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Project Description</label>
        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="Enter project description..."
          className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary resize-none"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">Project Color</label>
        <div className="grid grid-cols-6 gap-3">
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => setProjectColor(color)}
              className={`h-12 rounded-lg ${color} transition-all ${
                projectColor === color ? "ring-4 ring-foreground/20 scale-105" : "hover:scale-105"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <NokiButton onClick={handleAddProject} variant="positive" size="sm" disabled={!projectName.trim()}>
          Create Project
        </NokiButton>
        <NokiButton onClick={() => setViewMode("overview")} variant="negative" size="sm">
          Cancel
        </NokiButton>
      </div>
    </div>
  )

  const renderAddTask = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Select Project/Course</label>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setProjectType("personal")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              projectType === "personal"
                ? "bg-noki-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <FolderKanban className="inline mr-2" size={16} />
            Personal
          </button>
          <button
            onClick={() => setProjectType("canvas")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              projectType === "canvas"
                ? "bg-noki-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <BookOpen className="inline mr-2" size={16} />
            Canvas
          </button>
        </div>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
        >
          <option value="">Select {projectType === "personal" ? "project" : "course"}...</option>
          {projectType === "personal"
            ? personalProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))
            : canvasCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Task Title</label>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Enter task title..."
          className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <CalendarIcon className="inline mr-2" size={14} />
            Due Date
          </label>
          <input
            type="date"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
            className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Clock className="inline mr-2" size={14} />
            Due Time
          </label>
          <input
            type="time"
            value={taskDueTime}
            onChange={(e) => setTaskDueTime(e.target.value)}
            className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <NokiButton
          onClick={handleAddTask}
          variant="positive"
          size="sm"
          disabled={!selectedProject || !taskTitle.trim()}
        >
          Add Task
        </NokiButton>
        <NokiButton onClick={() => setViewMode("overview")} variant="negative" size="sm">
          Cancel
        </NokiButton>
      </div>
    </div>
  )

  const renderAddTodo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Select Project/Course</label>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setProjectType("personal")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              projectType === "personal"
                ? "bg-noki-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <FolderKanban className="inline mr-2" size={16} />
            Personal
          </button>
          <button
            onClick={() => setProjectType("canvas")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              projectType === "canvas"
                ? "bg-noki-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <BookOpen className="inline mr-2" size={16} />
            Canvas
          </button>
        </div>

        <select
          value={selectedProject}
          onChange={(e) => {
            setSelectedProject(e.target.value)
            setSelectedTask("")
          }}
          className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary mb-3"
        >
          <option value="">Select {projectType === "personal" ? "project" : "course"}...</option>
          {projectType === "personal"
            ? personalProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))
            : canvasCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
        </select>

        {selectedProject && (
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
          >
            <option value="">Select {projectType === "personal" ? "task" : "assignment"}...</option>
            {projectType === "personal"
              ? tasks
                  .filter((task) => task.projectId === selectedProject)
                  .map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))
              : assignments
                  .filter((assignment) => assignment.courseId === selectedProject)
                  .map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.title}
                    </option>
                  ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Todo Title</label>
        <input
          type="text"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          placeholder="Enter todo title..."
          className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <CalendarIcon className="inline mr-2" size={14} />
            Due Date
          </label>
          <input
            type="date"
            value={todoDueDate}
            onChange={(e) => setTodoDueDate(e.target.value)}
            className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Clock className="inline mr-2" size={14} />
            Due Time
          </label>
          <input
            type="time"
            value={todoDueTime}
            onChange={(e) => setTodoDueTime(e.target.value)}
            className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <NokiButton
          onClick={handleAddTodo}
          variant="positive"
          size="sm"
          disabled={!selectedProject || !selectedTask || !todoTitle.trim()}
        >
          Add Todo
        </NokiButton>
        <NokiButton onClick={() => setViewMode("overview")} variant="negative" size="sm">
          Cancel
        </NokiButton>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-3xl shadow-2xl w-full max-w-2xl border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3 flex-1">
            {viewMode !== "overview" && (
              <button
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h3 className="font-poppins font-bold text-xl text-foreground">
                {viewMode === "overview" && "Manage Projects & Tasks"}
                {viewMode === "add-project" && "Create New Project"}
                {viewMode === "add-task" && "Add New Task"}
                {viewMode === "add-todo" && "Add New Todo"}
                {viewMode === "manage-projects" && "Manage Personal Projects"}
                {viewMode === "manage-canvas" && "Manage Canvas Courses"}
                {viewMode === "manage-tasks" && "Manage Tasks"}
                {viewMode === "manage-todos" && "Manage Todos"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {viewMode === "overview" && "Create and organize your projects, tasks, and todos"}
                {viewMode === "add-project" && "Create a new personal project"}
                {viewMode === "add-task" && "Add a task to your project or course"}
                {viewMode === "add-todo" && "Add a todo item to a task or assignment"}
                {viewMode === "manage-projects" && "Edit and delete your personal projects"}
                {viewMode === "manage-canvas" && "Customize your Canvas course settings"}
                {viewMode === "manage-tasks" && "Edit and delete tasks in this project"}
                {viewMode === "manage-todos" && "Edit and delete your todo items"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {viewMode === "overview" && renderOverview()}
          {viewMode === "add-project" && renderAddProject()}
          {viewMode === "add-task" && renderAddTask()}
          {viewMode === "add-todo" && renderAddTodo()}
          {viewMode === "manage-projects" && renderManageProjects()}
          {viewMode === "manage-canvas" && renderManageCanvas()}
          {viewMode === "manage-tasks" && renderManageTasks()}
          {viewMode === "manage-todos" && renderManageTodos()}
        </div>
      </div>
    </div>
  )
}
