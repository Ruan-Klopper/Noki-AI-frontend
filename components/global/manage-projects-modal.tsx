"use client";

import { useState, useEffect } from "react";
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
  Check,
  ChevronDown,
} from "lucide-react";
import { NokiButton } from "./noki-button";
import { DateTimePicker } from "@/components/ui/date-time-picker";

interface ManageProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: any;
  editingType?: "project" | "course" | null;
  initialTab?: TabMode;
}

type TabMode = "projects" | "tasks" | "todos";
type ProjectType = "personal" | "canvas";

export function ManageProjectsModal({
  isOpen,
  onClose,
  editingItem,
  editingType,
  initialTab,
}: ManageProjectsModalProps) {
  const [activeTab, setActiveTab] = useState<TabMode>("projects");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string>("");
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );

  // Form states
  const [projectType, setProjectType] = useState<ProjectType>("personal");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectColor, setProjectColor] = useState("bg-noki-primary");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskDueDateTime, setTaskDueDateTime] = useState<Date | undefined>(
    undefined
  );
  const [todoTitle, setTodoTitle] = useState("");
  const [todoTask, setTodoTask] = useState("");
  const [todoDueDateTime, setTodoDueDateTime] = useState<Date | undefined>(
    undefined
  );
  const [todoFilter, setTodoFilter] = useState<"all" | "personal" | "canvas">(
    "all"
  );

  const personalProjects = [
    {
      id: "1",
      name: "Portfolio Website Redesign",
      description: "Redesign my portfolio with modern UI",
      color: "bg-noki-primary",
      type: "personal" as const,
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "Build a productivity app",
      color: "bg-noki-tertiary",
      type: "personal" as const,
    },
  ];

  const canvasCourses = [
    {
      id: "c1",
      name: "Interactive Development 300",
      code: "DV300",
      color: "bg-blue-400",
      type: "canvas" as const,
    },
    {
      id: "c2",
      name: "Photography 300",
      code: "PH300",
      color: "bg-purple-400",
      type: "canvas" as const,
    },
  ];

  const allProjects = [...personalProjects, ...canvasCourses];

  const tasks = [
    {
      id: "t1",
      title: "Design new homepage layout",
      projectId: "1",
      dueDate: "2025-02-15",
      dueTime: "14:00",
    },
    {
      id: "t2",
      title: "Implement dark mode",
      projectId: "1",
      dueDate: "2025-02-20",
      dueTime: "16:00",
    },
    {
      id: "t3",
      title: "Setup project structure",
      projectId: "2",
      dueDate: "2025-02-18",
      dueTime: "10:00",
    },
    {
      id: "t4",
      title: "Mobile App Prototype",
      projectId: "c1",
      dueDate: "2025-02-25",
      dueTime: "23:59",
    },
  ];

  const todos = [
    {
      id: "td1",
      title: "Create wireframes",
      taskId: "t1",
      projectId: "1",
      type: "personal" as const,
      dueDate: "2025-02-14",
      dueTime: "12:00",
      completed: false,
    },
    {
      id: "td2",
      title: "Research color schemes",
      taskId: "t1",
      projectId: "1",
      type: "personal" as const,
      dueDate: "2025-02-14",
      dueTime: "15:00",
      completed: true,
    },
    {
      id: "td3",
      title: "Write project proposal",
      taskId: "t4",
      projectId: "c1",
      type: "canvas" as const,
      dueDate: "2025-02-16",
      dueTime: "09:00",
      completed: false,
    },
  ];

  const colorOptions = [
    "bg-noki-primary",
    "bg-noki-tertiary",
    "bg-orange-400",
    "bg-purple-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-pink-400",
    "bg-yellow-400",
    "bg-red-400",
    "bg-teal-400",
    "bg-cyan-400",
    "bg-indigo-400",
  ];

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setShowAddForm(false);
      setEditingId("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const resetForm = () => {
    setProjectName("");
    setProjectDescription("");
    setProjectColor("bg-noki-primary");
    setTaskTitle("");
    setTaskProject("");
    setTaskDueDateTime(undefined);
    setTodoTitle("");
    setTodoTask("");
    setTodoDueDateTime(undefined);
    setProjectType("personal");
  };

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleSaveProject = () => {
    console.log("[v0] Saving project:", {
      projectName,
      projectDescription,
      projectColor,
      projectType,
    });
    resetForm();
    setShowAddForm(false);
    setEditingId("");
  };

  const handleSaveTask = () => {
    console.log("[v0] Saving task:", {
      taskTitle,
      taskProject,
      taskDueDateTime,
    });
    resetForm();
    setShowAddForm(false);
    setEditingId("");
  };

  const handleSaveTodo = () => {
    console.log("[v0] Saving todo:", { todoTitle, todoTask, todoDueDateTime });
    resetForm();
    setShowAddForm(false);
    setEditingId("");
  };

  const handleEditProject = (project: any) => {
    setEditingId(project.id);
    setProjectName(project.name);
    setProjectDescription(project.description || "");
    setProjectColor(project.color);
    setProjectType(project.type);
    setShowAddForm(false);
  };

  const handleEditTask = (task: any) => {
    setEditingId(task.id);
    setTaskTitle(task.title);
    setTaskProject(task.projectId);
    if (task.dueDate && task.dueTime) {
      const [hours, minutes] = task.dueTime.split(":");
      const date = new Date(task.dueDate);
      date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
      setTaskDueDateTime(date);
    }
    setShowAddForm(false);
  };

  const handleEditTodo = (todo: any) => {
    setEditingId(todo.id);
    setTodoTitle(todo.title);
    setTodoTask(todo.taskId);
    if (todo.dueDate && todo.dueTime) {
      const [hours, minutes] = todo.dueTime.split(":");
      const date = new Date(todo.dueDate);
      date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
      setTodoDueDateTime(date);
    }
    setShowAddForm(false);
  };

  const handleDelete = (id: string, type: string) => {
    console.log("[v0] Deleting:", type, id);
  };

  const handleToggleTodo = (id: string) => {
    console.log("[v0] Toggling todo:", id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-3xl shadow-2xl w-full max-w-4xl border border-border max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div>
            <h3 className="font-poppins font-bold text-xl text-foreground">
              Project Management
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage your projects, tasks, and todos
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4 border-b border-border flex-shrink-0">
          <button
            onClick={() => {
              setActiveTab("projects");
              setShowAddForm(false);
              setEditingId("");
            }}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === "projects"
                ? "bg-noki-primary text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <FolderKanban className="inline mr-2" size={16} />
            Projects
          </button>
          <button
            onClick={() => {
              setActiveTab("tasks");
              setShowAddForm(false);
              setEditingId("");
            }}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === "tasks"
                ? "bg-noki-primary text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <ListTodo className="inline mr-2" size={16} />
            Tasks
          </button>
          <button
            onClick={() => {
              setActiveTab("todos");
              setShowAddForm(false);
              setEditingId("");
            }}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === "todos"
                ? "bg-noki-primary text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Check className="inline mr-2" size={16} />
            Todos
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-3">
              {/* Add Project Button */}
              {!showAddForm && !editingId && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full p-4 border-2 border-dashed border-noki-primary/30 rounded-xl hover:border-noki-primary/50 hover:bg-noki-primary/5 transition-all group"
                >
                  <div className="flex items-center justify-center gap-2 text-noki-primary">
                    <Plus size={20} />
                    <span className="font-medium">Add New Project</span>
                  </div>
                </button>
              )}

              {/* Add/Edit Project Form */}
              {(showAddForm || editingId) && activeTab === "projects" && (
                <div className="border-2 border-noki-primary/30 rounded-xl p-4 bg-noki-primary/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">
                      {editingId ? "Edit Project" : "New Project"}
                    </h4>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId("");
                        resetForm();
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setProjectType("personal")}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        projectType === "personal"
                          ? "bg-noki-primary text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <FolderKanban className="inline mr-1" size={14} />
                      Personal
                    </button>
                    <button
                      onClick={() => setProjectType("canvas")}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        projectType === "canvas"
                          ? "bg-noki-primary text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <BookOpen className="inline mr-1" size={14} />
                      Canvas
                    </button>
                  </div>

                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project name..."
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary text-sm"
                    autoFocus
                  />

                  {projectType === "personal" && (
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Description (optional)..."
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary resize-none text-sm"
                      rows={2}
                    />
                  )}

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Color
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setProjectColor(color)}
                          className={`h-8 rounded-lg ${color} transition-all ${
                            projectColor === color
                              ? "ring-2 ring-foreground/30 scale-110"
                              : "hover:scale-105"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <NokiButton
                      onClick={handleSaveProject}
                      variant="positive"
                      size="sm"
                      disabled={!projectName.trim()}
                    >
                      {editingId ? "Save Changes" : "Create Project"}
                    </NokiButton>
                    <NokiButton
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId("");
                        resetForm();
                      }}
                      variant="neutral"
                      size="sm"
                    >
                      Cancel
                    </NokiButton>
                  </div>
                </div>
              )}

              {/* Projects List */}
              <div className="space-y-2">
                {allProjects.map((project) => {
                  const projectTasks = tasks.filter(
                    (t) => t.projectId === project.id
                  );
                  return (
                    <div
                      key={project.id}
                      className="border border-border rounded-xl p-3 hover:border-noki-primary/30 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 ${project.color} rounded-lg flex-shrink-0`}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">
                            {project.name}
                          </h4>
                          {"description" in project && project.description && (
                            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                              {project.description}
                            </p>
                          )}
                          {"code" in project && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {project.code}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditProject(project)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Edit2
                              size={14}
                              className="text-muted-foreground hover:text-foreground"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id, "project")}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                      {projectTasks.length > 0 && (
                        <button
                          onClick={() => toggleProject(project.id)}
                          className="mt-2 w-full text-left text-xs text-noki-primary hover:text-noki-primary/80 flex items-center gap-1"
                        >
                          {expandedProjects.has(project.id) ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                          Manage {projectTasks.length} Tasks
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div className="space-y-3">
              {/* Add Task Button */}
              {!showAddForm && !editingId && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full p-4 border-2 border-dashed border-noki-tertiary/30 rounded-xl hover:border-noki-tertiary/50 hover:bg-noki-tertiary/5 transition-all group"
                >
                  <div className="flex items-center justify-center gap-2 text-noki-tertiary">
                    <Plus size={20} />
                    <span className="font-medium">Add New Task</span>
                  </div>
                </button>
              )}

              {/* Add/Edit Task Form */}
              {(showAddForm || editingId) && activeTab === "tasks" && (
                <div className="border-2 border-noki-tertiary/30 rounded-xl p-4 bg-noki-tertiary/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">
                      {editingId ? "Edit Task" : "New Task"}
                    </h4>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId("");
                        resetForm();
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <select
                    value={taskProject}
                    onChange={(e) => setTaskProject(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary text-sm"
                  >
                    <option value="">Select project...</option>
                    {allProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Task title..."
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary text-sm"
                  />

                  <DateTimePicker
                    value={taskDueDateTime}
                    onChange={setTaskDueDateTime}
                    placeholder="Select due date and time..."
                  />

                  <div className="flex gap-2">
                    <NokiButton
                      onClick={handleSaveTask}
                      variant="positive"
                      size="sm"
                      disabled={!taskTitle.trim() || !taskProject}
                    >
                      {editingId ? "Save Changes" : "Create Task"}
                    </NokiButton>
                    <NokiButton
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId("");
                        resetForm();
                      }}
                      variant="neutral"
                      size="sm"
                    >
                      Cancel
                    </NokiButton>
                  </div>
                </div>
              )}

              {/* Tasks List Grouped by Project */}
              <div className="space-y-3">
                {allProjects.map((project) => {
                  const projectTasks = tasks.filter(
                    (t) => t.projectId === project.id
                  );
                  if (projectTasks.length === 0) return null;

                  return (
                    <div
                      key={project.id}
                      className="border border-border rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleProject(project.id)}
                        className="w-full p-3 bg-muted/30 hover:bg-muted/50 transition-colors flex items-center gap-3"
                      >
                        {expandedProjects.has(project.id) ? (
                          <ChevronDown
                            size={16}
                            className="text-muted-foreground"
                          />
                        ) : (
                          <ChevronRight
                            size={16}
                            className="text-muted-foreground"
                          />
                        )}
                        <div
                          className={`w-8 h-8 ${project.color} rounded-lg flex-shrink-0`}
                        />
                        <span className="font-semibold text-foreground text-sm">
                          {project.name}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {projectTasks.length} tasks
                        </span>
                      </button>

                      {expandedProjects.has(project.id) && (
                        <div className="p-2 space-y-2">
                          {projectTasks.map((task) => (
                            <div
                              key={task.id}
                              className="border border-border rounded-lg p-3 hover:border-noki-primary/30 transition-all group"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-foreground text-sm">
                                    {task.title}
                                  </h5>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <CalendarIcon size={12} />
                                      {task.dueDate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock size={12} />
                                      {task.dueTime}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleEditTask(task)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                  >
                                    <Edit2
                                      size={14}
                                      className="text-muted-foreground hover:text-foreground"
                                    />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete(task.id, "task")
                                    }
                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    <Trash2
                                      size={14}
                                      className="text-red-400"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Todos Tab */}
          {activeTab === "todos" && (
            <div className="space-y-3">
              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setTodoFilter("all")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    todoFilter === "all"
                      ? "bg-noki-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTodoFilter("personal")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    todoFilter === "personal"
                      ? "bg-noki-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Personal
                </button>
                <button
                  onClick={() => setTodoFilter("canvas")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    todoFilter === "canvas"
                      ? "bg-noki-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Canvas
                </button>
              </div>

              {/* Add Todo Button */}
              {!showAddForm && !editingId && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full p-4 border-2 border-dashed border-orange-400/30 rounded-xl hover:border-orange-400/50 hover:bg-orange-400/5 transition-all group"
                >
                  <div className="flex items-center justify-center gap-2 text-orange-600">
                    <Plus size={20} />
                    <span className="font-medium">Add New Todo</span>
                  </div>
                </button>
              )}

              {/* Add/Edit Todo Form */}
              {(showAddForm || editingId) && activeTab === "todos" && (
                <div className="border-2 border-orange-400/30 rounded-xl p-4 bg-orange-400/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">
                      {editingId ? "Edit Todo" : "New Todo"}
                    </h4>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId("");
                        resetForm();
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <select
                    value={todoTask}
                    onChange={(e) => setTodoTask(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary text-sm"
                  >
                    <option value="">Select task...</option>
                    {tasks.map((task) => {
                      const project = allProjects.find(
                        (p) => p.id === task.projectId
                      );
                      return (
                        <option key={task.id} value={task.id}>
                          {task.title} ({project?.name})
                        </option>
                      );
                    })}
                  </select>

                  <input
                    type="text"
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                    placeholder="Todo title..."
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary text-sm"
                  />

                  <DateTimePicker
                    value={todoDueDateTime}
                    onChange={setTodoDueDateTime}
                    placeholder="Select due date and time..."
                  />

                  <div className="flex gap-2">
                    <NokiButton
                      onClick={handleSaveTodo}
                      variant="positive"
                      size="sm"
                      disabled={!todoTitle.trim() || !todoTask}
                    >
                      {editingId ? "Save Changes" : "Create Todo"}
                    </NokiButton>
                    <NokiButton
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId("");
                        resetForm();
                      }}
                      variant="neutral"
                      size="sm"
                    >
                      Cancel
                    </NokiButton>
                  </div>
                </div>
              )}

              {/* Todos List */}
              <div className="space-y-2">
                {todos
                  .filter(
                    (todo) => todoFilter === "all" || todo.type === todoFilter
                  )
                  .map((todo) => {
                    const task = tasks.find((t) => t.id === todo.taskId);
                    const project = allProjects.find(
                      (p) => p.id === todo.projectId
                    );

                    return (
                      <div
                        key={todo.id}
                        className="border border-border rounded-lg p-3 hover:border-noki-primary/30 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleTodo(todo.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                              todo.completed
                                ? "bg-noki-primary border-noki-primary"
                                : "border-muted-foreground hover:border-noki-primary"
                            }`}
                          >
                            {todo.completed && (
                              <Check size={14} className="text-white" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h5
                              className={`font-medium text-sm ${
                                todo.completed
                                  ? "line-through text-muted-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {todo.title}
                            </h5>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded-full ${
                                  todo.type === "personal"
                                    ? "bg-noki-primary/20 text-noki-primary"
                                    : "bg-blue-500/20 text-blue-400"
                                }`}
                              >
                                {todo.type}
                              </span>
                              <span>{task?.title}</span>
                              <span>•</span>
                              <span>{project?.name}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarIcon size={12} />
                                {todo.dueDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {todo.dueTime}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditTodo(todo)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                              <Edit2
                                size={14}
                                className="text-muted-foreground hover:text-foreground"
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(todo.id, "todo")}
                              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
