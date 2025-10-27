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
  Settings,
  MoreVertical,
} from "lucide-react";
import { NokiButton } from "./noki-button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Input,
  Select,
  Form,
  Space,
  Row,
  Col,
  Card,
  Tabs,
  Button,
  Badge,
  Dropdown,
  Menu,
  Tag,
  Avatar,
  Tooltip,
  Divider,
  Empty,
  Statistic,
} from "antd";
import {
  FolderOutlined,
  BookOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMain } from "@/services/hooks/useMain";
import { useProjects } from "@/services/hooks/useProjects";
import { useTask } from "@/services/hooks/useTask";
import { useTodo } from "@/services/hooks/useTodo";
import {
  utcToLocalDateString,
  utcToLocalTimeString,
} from "@/lib/timezone-config";

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
  const [isMounted, setIsMounted] = useState(false);

  const { getDB } = useMain();

  // Initialize hooks for CRUD operations
  const { createProject, updateProject, deleteProject } = useProjects();
  const { createTask, updateTask, deleteTask, completeTask } = useTask();
  const { createTodo, updateTodos, deleteTodos, completeTodo } = useTodo();

  const [activeTab, setActiveTab] = useState<TabMode>("projects");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string>("");
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );

  // Data states
  const [personalProjects, setPersonalProjects] = useState<any[]>([]);
  const [canvasCourses, setCanvasCourses] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Set mounted state when component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to refresh data from IndexedDB
  const refreshData = async () => {
    try {
      const db = getDB();
      await db.init();

      const [fetchedProjects, fetchedTasks, fetchedTodos] = await Promise.all([
        db.getProjects(),
        db.getTasks(),
        db.getTodos(),
      ]);

      console.log("[ManageProjectsModal] Refreshed data:", {
        projects: fetchedProjects.length,
        tasks: fetchedTasks.length,
        todos: fetchedTodos.length,
      });

      // Store all projects
      setProjects(fetchedProjects);

      // Separate personal and canvas projects
      const personal = fetchedProjects.filter(
        (p: any) => p.source === "Personal" || !p.source
      );
      const canvas = fetchedProjects.filter((p: any) => p.source === "Canvas");

      setPersonalProjects(
        personal.map((project: any) => ({
          id: project.id,
          name: project.title || project.name || "Untitled Project",
          description: project.description || "",
          color: project.color_hex || "bg-noki-primary",
          colorHex: project.color_hex,
          type: "personal" as const,
        }))
      );

      setCanvasCourses(
        canvas.map((project: any) => ({
          id: project.id,
          name: project.title || project.name || "Untitled Course",
          code: project.course_code || "",
          color: project.color_hex || "bg-blue-400",
          colorHex: project.color_hex,
          type: "canvas" as const,
        }))
      );

      // Format tasks
      setTasks(
        fetchedTasks.map((task: any) => ({
          id: task.id,
          title: task.title || "Untitled Task",
          projectId: task.project_id,
          dueDate: task.due_date ? utcToLocalDateString(task.due_date) : null,
          dueTime: task.due_date ? utcToLocalTimeString(task.due_date) : null,
          completed: task.is_submitted || false,
          priority: task.priority,
        }))
      );

      // Format todos
      setTodos(
        fetchedTodos.map((todo: any) => {
          // Find the task to get projectId
          const task = fetchedTasks.find((t: any) => t.id === todo.task_id);
          const project = task
            ? fetchedProjects.find((p: any) => p.id === task.project_id)
            : null;
          const type =
            project?.source === "Canvas" ? "canvas" : ("personal" as const);

          return {
            id: todo.id,
            title: todo.title || "Untitled Todo",
            taskId: todo.task_id,
            projectId: task?.project_id || "",
            type: type,
            dueDate: todo.due_date ? utcToLocalDateString(todo.due_date) : null,
            dueTime: todo.due_date ? utcToLocalTimeString(todo.due_date) : null,
            completed: todo.is_submitted || false,
            priority: todo.priority,
          };
        })
      );
    } catch (error) {
      console.error("[ManageProjectsModal] Error refreshing data:", error);
    }
  };

  // Fetch data from IndexedDB
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      console.log("[ManageProjectsModal] Fetching data from IndexedDB...");
      await refreshData();
      setIsLoading(false);
    };

    fetchData();
  }, [isOpen]); // getDB is a stable reference, no need to include it

  const allProjects = [...personalProjects, ...canvasCourses];

  // Helper function to format date for display
  const formatDueDate = (dateStr: string | null): string => {
    if (!dateStr) return "No date";

    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("[ManageProjectsModal] Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Helper function to check if an item is overdue
  const isOverdue = (dateStr: string | null, isCompleted: boolean): boolean => {
    if (!dateStr || isCompleted) return false;

    try {
      const itemDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      itemDate.setHours(0, 0, 0, 0);

      return itemDate < today;
    } catch (error) {
      return false;
    }
  };

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

  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      return;
    }

    try {
      if (editingId) {
        // Update existing project
        console.log("### Backend ### Update project: Sending request...");
        const result = await updateProject(editingId, {
          title: projectName.trim(),
          description: projectDescription.trim() || undefined,
          color_hex: projectColor,
        });
        console.log(
          "### Backend ### Update project: Backend response:",
          result
        );

        if (result) {
          console.log(
            "### IndexedDB ### Updating project in IndexedDB:",
            result
          );
          // Refresh data from IndexedDB
          await refreshData();
          console.log("### IndexedDB ### Project updated and data refreshed");
          resetForm();
          setShowAddForm(false);
          setEditingId("");
        }
      } else {
        // Create new project
        console.log("### Backend ### Create project: Sending request...");
        const result = await createProject({
          title: projectName.trim(),
          description: projectDescription.trim() || undefined,
          color_hex: projectColor,
          source: projectType === "personal" ? "Personal" : "Canvas",
        });
        console.log(
          "### Backend ### Create project: Backend response:",
          result
        );

        if (result) {
          console.log("### IndexedDB ### Saving project to IndexedDB:", result);
          // Refresh data from IndexedDB
          await refreshData();
          console.log("### IndexedDB ### Project saved and data refreshed");
          resetForm();
          setShowAddForm(false);
        }
      }
    } catch (error) {
      console.error("[ManageProjectsModal] Error saving project:", error);
    }
  };

  const handleSaveTask = async () => {
    if (!taskTitle.trim() || !taskProject) {
      return;
    }

    try {
      if (editingId) {
        // Update existing task
        console.log("### Backend ### Update task: Sending request...");
        const result = await updateTask(editingId, {
          title: taskTitle.trim(),
          due_date: taskDueDateTime ? taskDueDateTime.toISOString() : undefined,
        });
        console.log("### Backend ### Update task: Backend response:", result);

        if (result) {
          console.log("### IndexedDB ### Updating task in IndexedDB:", result);
          // Refresh data from IndexedDB
          await refreshData();
          console.log("### IndexedDB ### Task updated and data refreshed");
          resetForm();
          setShowAddForm(false);
          setEditingId("");
        }
      } else {
        // Create new task
        console.log("### Backend ### Create task: Sending request...");
        const result = await createTask({
          title: taskTitle.trim(),
          type: "Personal", // Default to Personal type
          project_id: taskProject,
          due_date: taskDueDateTime ? taskDueDateTime.toISOString() : undefined,
          priority: "Medium", // Default priority
        });
        console.log("### Backend ### Create task: Backend response:", result);

        if (result) {
          console.log("### IndexedDB ### Saving task to IndexedDB:", result);
          // Refresh data from IndexedDB
          await refreshData();
          console.log("### IndexedDB ### Task saved and data refreshed");
          resetForm();
          setShowAddForm(false);
        }
      }
    } catch (error) {
      console.error("[ManageProjectsModal] Error saving task:", error);
    }
  };

  const handleSaveTodo = async () => {
    if (!todoTitle.trim() || !todoTask) {
      return;
    }

    try {
      if (editingId) {
        // Update existing todo
        console.log("### Backend ### Update todo: Sending request...");
        const result = await updateTodos([editingId], {
          title: todoTitle.trim(),
          due_date: todoDueDateTime ? todoDueDateTime.toISOString() : undefined,
        });
        console.log("### Backend ### Update todo: Backend response:", result);

        if (result) {
          console.log("### IndexedDB ### Updating todo in IndexedDB:", result);
          // Refresh data from IndexedDB
          await refreshData();
          console.log("### IndexedDB ### Todo updated and data refreshed");
          resetForm();
          setShowAddForm(false);
          setEditingId("");
        }
      } else {
        // Create new todo
        console.log("### Backend ### Create todo: Sending request...");
        const result = await createTodo(todoTask, {
          title: todoTitle.trim(),
          due_date: todoDueDateTime ? todoDueDateTime.toISOString() : undefined,
          priority: "Medium", // Default priority
        });
        console.log("### Backend ### Create todo: Backend response:", result);

        if (result) {
          console.log("### IndexedDB ### Saving todo to IndexedDB:", result);
          // Refresh data from IndexedDB
          await refreshData();
          console.log("### IndexedDB ### Todo saved and data refreshed");
          resetForm();
          setShowAddForm(false);
        }
      }
    } catch (error) {
      console.error("[ManageProjectsModal] Error saving todo:", error);
    }
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

  const handleDelete = async (id: string, type: string) => {
    try {
      if (type === "project") {
        console.log(
          `### Backend ### Deletion of project: Sending request for ID ${id}`
        );
        const result = await deleteProject(id);
        console.log(
          "### Backend ### Deletion of project: Backend response:",
          result
        );
        if (result) {
          console.log(
            `### IndexedDB ### Deleting project from IndexedDB: ${id}`
          );
          await refreshData();
          console.log("### IndexedDB ### Project deleted and data refreshed");
        }
      } else if (type === "task") {
        console.log(
          `### Backend ### Deletion of task: Sending request for ID ${id}`
        );
        const result = await deleteTask(id);
        console.log(
          "### Backend ### Deletion of task: Backend response:",
          result
        );
        if (result) {
          console.log(`### IndexedDB ### Deleting task from IndexedDB: ${id}`);
          await refreshData();
          console.log("### IndexedDB ### Task deleted and data refreshed");
        }
      } else if (type === "todo") {
        console.log(
          `### Backend ### Deletion of todo: Sending request for ID ${id}`
        );
        const result = await deleteTodos([id]);
        console.log(
          "### Backend ### Deletion of todo: Backend response:",
          result
        );
        if (result) {
          console.log(`### IndexedDB ### Deleting todo from IndexedDB: ${id}`);
          await refreshData();
          console.log("### IndexedDB ### Todo deleted and data refreshed");
        }
      }
    } catch (error) {
      console.error(`[ManageProjectsModal] Error deleting ${type}:`, error);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      if (todo.completed) {
        // Uncomplete todo - set is_submitted to false
        console.log(
          `### Backend ### Uncomplete todo: Sending request for ID ${id}`
        );
        const result = await updateTodos([id], { is_submitted: false });
        console.log(
          "### Backend ### Uncomplete todo: Backend response:",
          result
        );
        if (result) {
          console.log(`### IndexedDB ### Updating todo in IndexedDB: ${id}`);
          await refreshData();
          console.log("### IndexedDB ### Todo uncompleted and data refreshed");
        }
      } else {
        // Complete todo
        console.log(
          `### Backend ### Complete todo: Sending request for ID ${id}`
        );
        const result = await completeTodo(id);
        console.log("### Backend ### Complete todo: Backend response:", result);
        if (result) {
          console.log(`### IndexedDB ### Updating todo in IndexedDB: ${id}`);
          await refreshData();
          console.log("### IndexedDB ### Todo completed and data refreshed");
        }
      }
    } catch (error) {
      console.error("[ManageProjectsModal] Error toggling todo:", error);
    }
  };

  // Don't render during SSR or if not mounted
  if (!isMounted || !isOpen) return null;

  // Calculate statistics
  const totalProjects = allProjects.length;
  const totalTasks = tasks.length;
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;

  const tabItems = [
    {
      key: "projects",
      label: (
        <span className="flex items-center gap-2">
          <FolderOutlined />
          Projects
          <Badge count={totalProjects} size="small" />
        </span>
      ),
    },
    {
      key: "tasks",
      label: (
        <span className="flex items-center gap-2">
          <ListTodo size={16} />
          Tasks
          <Badge count={totalTasks} size="small" />
        </span>
      ),
    },
    {
      key: "todos",
      label: (
        <span className="flex items-center gap-2">
          <CheckSquareOutlined />
          Todos
          <Badge count={totalTodos} size="small" />
        </span>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl border border-border max-h-[95vh] flex flex-col">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-noki-primary/10 to-noki-tertiary/10 p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-noki-primary to-noki-tertiary rounded-lg flex items-center justify-center">
                <Settings className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-xl text-foreground">
                  Project Management
                </h3>
                <p className="text-xs text-muted-foreground">
                  Organize your work with projects, tasks, and todos
                </p>
              </div>
            </div>

            {/* Statistics in Header */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-noki-primary">
                    {totalProjects}
                  </div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-noki-tertiary">
                    {totalTasks}
                  </div>
                  <div className="text-xs text-muted-foreground">Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-500">
                    {totalTodos}
                  </div>
                  <div className="text-xs text-muted-foreground">Todos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-500">
                    {completedTodos}
                  </div>
                  <div className="text-xs text-muted-foreground">Done</div>
                </div>
              </div>
              <Button
                type="text"
                icon={<X size={18} />}
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="px-4 pt-3 flex-shrink-0">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key as TabMode);
              setShowAddForm(false);
              setEditingId("");
            }}
            items={tabItems}
            className="project-management-tabs"
            size="middle"
          />
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-noki-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div className="space-y-4 gap-4 flex flex-col gap-4">
                  {/* Add Project Button */}
                  {!showAddForm && !editingId && (
                    <Card
                      hoverable
                      onClick={() => setShowAddForm(true)}
                      className="border-2 border-dashed border-noki-primary/30 hover:border-noki-primary/50 transition-all cursor-pointer mb-4"
                    >
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-noki-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <PlusOutlined className="text-noki-primary text-xl" />
                        </div>
                        <h4 className="text-base font-semibold text-foreground mb-1">
                          Create New Project
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Start organizing your work with a new project
                        </p>
                      </div>
                    </Card>
                  )}

                  {/* Add/Edit Project Form */}
                  {(showAddForm || editingId) && activeTab === "projects" && (
                    <Card
                      title={editingId ? "Edit Project" : "New Project"}
                      extra={
                        <Button
                          type="text"
                          icon={<X size={16} />}
                          onClick={() => {
                            setShowAddForm(false);
                            setEditingId("");
                            resetForm();
                          }}
                        />
                      }
                      className="border-noki-primary/30"
                    >
                      <Form layout="vertical" className="space-y-4">
                        {/* Project Type Selection */}
                        <Form.Item label="Project Type" required>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setProjectType("personal")}
                              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                projectType === "personal"
                                  ? "bg-noki-primary text-white shadow-md"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                              }`}
                            >
                              <FolderKanban size={16} />
                              Personal Project
                            </button>
                            <button
                              onClick={() => setProjectType("canvas")}
                              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                projectType === "canvas"
                                  ? "bg-noki-primary text-white shadow-md"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                              }`}
                            >
                              <BookOpen size={16} />
                              Canvas Course
                            </button>
                          </div>
                        </Form.Item>

                        {/* Project Name */}
                        <Form.Item label="Project Name" required>
                          <Input
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Enter project name..."
                            size="large"
                            className="w-full"
                            autoFocus
                          />
                        </Form.Item>

                        {/* Description (only for personal projects) */}
                        {projectType === "personal" && (
                          <Form.Item label="Description">
                            <Input.TextArea
                              value={projectDescription}
                              onChange={(e) =>
                                setProjectDescription(e.target.value)
                              }
                              placeholder="Enter project description (optional)..."
                              rows={3}
                              className="w-full"
                            />
                          </Form.Item>
                        )}

                        {/* Color Selection */}
                        <Form.Item label="Project Color">
                          <div className="grid grid-cols-6 gap-3">
                            {colorOptions.map((color) => (
                              <button
                                key={color}
                                onClick={() => setProjectColor(color)}
                                className={`h-12 rounded-lg ${color} transition-all ${
                                  projectColor === color
                                    ? "ring-2 ring-foreground/50 scale-105 shadow-lg"
                                    : "hover:scale-105 hover:shadow-md"
                                }`}
                                title={color
                                  .replace("bg-", "")
                                  .replace("-", " ")}
                              />
                            ))}
                          </div>
                        </Form.Item>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <NokiButton
                            onClick={handleSaveProject}
                            variant="positive"
                            size="sm"
                            disabled={!projectName.trim()}
                            className="flex-1"
                          >
                            {editingId ? "Save Changes" : "Create Project"}
                          </NokiButton>
                          <NokiButton
                            onClick={() => {
                              setShowAddForm(false);
                              setEditingId("");
                              resetForm();
                            }}
                            variant="negative"
                            size="sm"
                            className="flex-1"
                          >
                            Cancel
                          </NokiButton>
                        </div>
                      </Form>
                    </Card>
                  )}

                  {/* Projects Grid */}
                  <Row gutter={[12, 12]}>
                    {allProjects.map((project) => {
                      const projectTasks = tasks.filter(
                        (t) => t.projectId === project.id
                      );
                      const projectTodos = todos.filter(
                        (t) => t.projectId === project.id
                      );
                      const completedTodos = projectTodos.filter(
                        (t) => t.completed
                      ).length;

                      return (
                        <Col xs={24} sm={12} lg={8} key={project.id}>
                          <Card
                            hoverable
                            className="h-full border-2 hover:border-noki-primary/30 transition-all"
                            style={{
                              borderColor: project.color
                                .replace("bg-", "")
                                .replace("-400", "-200"),
                              backgroundColor: `${project.color
                                .replace("bg-", "")
                                .replace("-400", "-50")}10`,
                            }}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <Avatar
                                size={36}
                                className={`${project.color} flex items-center justify-center shadow-sm`}
                                icon={
                                  project.type === "personal" ? (
                                    <FolderOutlined />
                                  ) : (
                                    <BookOutlined />
                                  )
                                }
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground text-base mb-1 truncate">
                                  {project.name}
                                </h4>
                                {"description" in project &&
                                  project.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                                      {project.description}
                                    </p>
                                  )}
                                {"code" in project && (
                                  <Tag color="blue" className="mb-1">
                                    {project.code}
                                  </Tag>
                                )}
                                <Tag
                                  color={
                                    project.type === "personal"
                                      ? "green"
                                      : "blue"
                                  }
                                >
                                  {project.type}
                                </Tag>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                                  <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                      <span className="font-semibold text-noki-primary">
                                        {projectTasks.length}
                                      </span>
                                      tasks
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span className="font-semibold text-orange-500">
                                        {projectTodos.length}
                                      </span>
                                      todos
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span className="font-semibold text-green-500">
                                        {completedTodos}
                                      </span>
                                      done
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions aligned to bottom right */}
                            <div className="flex justify-end gap-1 mt-auto pt-2 border-t border-border/50">
                              <Tooltip title="Edit Project">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={() => handleEditProject(project)}
                                  className="text-muted-foreground hover:text-noki-primary"
                                />
                              </Tooltip>
                              <Tooltip title="Delete Project">
                                <Button
                                  type="text"
                                  size="small"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() =>
                                    handleDelete(project.id, "project")
                                  }
                                />
                              </Tooltip>
                            </div>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>

                  {allProjects.length === 0 && (
                    <Empty
                      description="No projects yet"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setShowAddForm(true)}
                      >
                        Create Your First Project
                      </Button>
                    </Empty>
                  )}
                </div>
              )}

              {/* Tasks Tab */}
              {activeTab === "tasks" && (
                <div className="space-y-4 flex flex-col gap-4">
                  {/* Add Task Button */}
                  {!showAddForm && !editingId && (
                    <Card
                      hoverable
                      onClick={() => setShowAddForm(true)}
                      className="border-2 border-dashed border-noki-tertiary/30 hover:border-noki-tertiary/50 transition-all cursor-pointer"
                    >
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-noki-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <PlusOutlined className="text-noki-tertiary text-xl" />
                        </div>
                        <h4 className="text-base font-semibold text-foreground mb-1">
                          Create New Task
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Add a new task to organize your work
                        </p>
                      </div>
                    </Card>
                  )}

                  {/* Add/Edit Task Form */}
                  {(showAddForm || editingId) && activeTab === "tasks" && (
                    <Card
                      title={editingId ? "Edit Task" : "New Task"}
                      extra={
                        <Button
                          type="text"
                          icon={<X size={16} />}
                          onClick={() => {
                            setShowAddForm(false);
                            setEditingId("");
                            resetForm();
                          }}
                        />
                      }
                      className="border-noki-tertiary/30"
                    >
                      <Form layout="vertical" className="space-y-4">
                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={12}>
                            <Form.Item label="Project" required>
                              <Select
                                value={taskProject}
                                onChange={setTaskProject}
                                placeholder="Select project..."
                                size="large"
                                className="w-full"
                              >
                                {allProjects.map((project) => (
                                  <Select.Option
                                    key={project.id}
                                    value={project.id}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-3 h-3 ${project.color} rounded-full`}
                                      />
                                      {project.name}
                                    </div>
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label="Due Date & Time">
                              <DateTimePicker
                                value={taskDueDateTime}
                                onChange={setTaskDueDateTime}
                                placeholder="Select due date and time..."
                                className="w-full"
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item label="Task Title" required>
                          <Input
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            placeholder="Enter task title..."
                            size="large"
                            className="w-full"
                          />
                        </Form.Item>

                        <div className="flex gap-3 pt-4">
                          <NokiButton
                            onClick={handleSaveTask}
                            variant="positive"
                            size="sm"
                            disabled={!taskTitle.trim() || !taskProject}
                            className="flex-1"
                          >
                            {editingId ? "Save Changes" : "Create Task"}
                          </NokiButton>
                          <NokiButton
                            onClick={() => {
                              setShowAddForm(false);
                              setEditingId("");
                              resetForm();
                            }}
                            variant="negative"
                            size="sm"
                            className="flex-1"
                          >
                            Cancel
                          </NokiButton>
                        </div>
                      </Form>
                    </Card>
                  )}

                  {/* Tasks by Project */}
                  <div className="space-y-3 flex flex-col gap-4">
                    {allProjects.map((project) => {
                      const projectTasks = tasks.filter(
                        (t) => t.projectId === project.id
                      );
                      if (projectTasks.length === 0) return null;

                      return (
                        <Card
                          key={project.id}
                          className="border-2 hover:border-noki-primary/30 transition-all"
                          style={{
                            borderColor: project.color
                              .replace("bg-", "")
                              .replace("-400", "-200"),
                            backgroundColor: `${project.color
                              .replace("bg-", "")
                              .replace("-400", "-50")}05`,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar
                                size={28}
                                className={`${project.color} flex items-center justify-center shadow-sm`}
                                icon={
                                  project.type === "personal" ? (
                                    <FolderOutlined />
                                  ) : (
                                    <BookOutlined />
                                  )
                                }
                              />
                              <div>
                                <h4 className="font-semibold text-foreground text-sm mb-0">
                                  {project.name}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-0">
                                  {projectTasks.length} tasks
                                </p>
                              </div>
                            </div>
                            <Button
                              type="text"
                              size="small"
                              icon={
                                expandedProjects.has(project.id) ? (
                                  <ChevronDown size={14} />
                                ) : (
                                  <ChevronRight size={14} />
                                )
                              }
                              onClick={() => toggleProject(project.id)}
                              className="text-muted-foreground hover:text-noki-primary"
                            >
                              {expandedProjects.has(project.id)
                                ? "Collapse"
                                : "Expand"}
                            </Button>
                          </div>

                          {expandedProjects.has(project.id) && (
                            <div className="pt-3 border-t border-border/50">
                              <Row gutter={[12, 12]}>
                                {projectTasks.map((task) => (
                                  <Col xs={24} sm={12} lg={8} key={task.id}>
                                    <Card
                                      size="small"
                                      hoverable
                                      className="h-full border border-border/50 hover:border-noki-primary/30 transition-all"
                                    >
                                      <div className="mb-2">
                                        <h5 className="font-medium text-foreground text-sm mb-2">
                                          {task.title}
                                        </h5>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                          <span className="flex items-center gap-1">
                                            <CalendarOutlined />
                                            {task.dueDate}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <ClockCircleOutlined />
                                            {task.dueTime}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Actions aligned to bottom right */}
                                      <div className="flex justify-end gap-1 mt-auto pt-2 border-t border-border/30">
                                        <Tooltip title="Edit Task">
                                          <Button
                                            type="text"
                                            size="small"
                                            icon={<EditOutlined />}
                                            onClick={() => handleEditTask(task)}
                                            className="text-muted-foreground hover:text-noki-primary"
                                          />
                                        </Tooltip>
                                        <Tooltip title="Delete Task">
                                          <Button
                                            type="text"
                                            size="small"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() =>
                                              handleDelete(task.id, "task")
                                            }
                                          />
                                        </Tooltip>
                                      </div>
                                    </Card>
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>

                  {tasks.length === 0 && (
                    <Empty
                      description="No tasks yet"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setShowAddForm(true)}
                      >
                        Create Your First Task
                      </Button>
                    </Empty>
                  )}
                </div>
              )}

              {/* Todos Tab */}
              {activeTab === "todos" && (
                <div className="space-y-4 flex flex-col gap-4">
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
                    <Card
                      hoverable
                      onClick={() => setShowAddForm(true)}
                      className="border-2 border-dashed border-orange-400/30 hover:border-orange-400/50 transition-all cursor-pointer mb-4"
                    >
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-orange-400/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <PlusOutlined className="text-orange-500 text-xl" />
                        </div>
                        <h4 className="text-base font-semibold text-foreground mb-1">
                          Create New Todo
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Add a new todo to track your progress
                        </p>
                      </div>
                    </Card>
                  )}

                  {/* Add/Edit Todo Form */}
                  {(showAddForm || editingId) && activeTab === "todos" && (
                    <Card
                      title={editingId ? "Edit Todo" : "New Todo"}
                      extra={
                        <Button
                          type="text"
                          icon={<X size={16} />}
                          onClick={() => {
                            setShowAddForm(false);
                            setEditingId("");
                            resetForm();
                          }}
                        />
                      }
                      className="border-orange-400/30"
                    >
                      <Form layout="vertical" className="space-y-4">
                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={12}>
                            <Form.Item label="Task" required>
                              <Select
                                value={todoTask}
                                onChange={setTodoTask}
                                placeholder="Select task..."
                                size="large"
                                className="w-full"
                              >
                                {tasks.map((task) => {
                                  const project = allProjects.find(
                                    (p) => p.id === task.projectId
                                  );
                                  return (
                                    <Select.Option
                                      key={task.id}
                                      value={task.id}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={`w-3 h-3 ${
                                            project?.color || "bg-gray-400"
                                          } rounded-full`}
                                        />
                                        <div>
                                          <div className="font-medium">
                                            {task.title}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {project?.name}
                                          </div>
                                        </div>
                                      </div>
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item label="Due Date & Time">
                              <DateTimePicker
                                value={todoDueDateTime}
                                onChange={setTodoDueDateTime}
                                placeholder="Select due date and time..."
                                className="w-full"
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item label="Todo Title" required>
                          <Input
                            value={todoTitle}
                            onChange={(e) => setTodoTitle(e.target.value)}
                            placeholder="Enter todo title..."
                            size="large"
                            className="w-full"
                          />
                        </Form.Item>

                        <div className="flex gap-3 pt-4">
                          <NokiButton
                            onClick={handleSaveTodo}
                            variant="positive"
                            size="sm"
                            disabled={!todoTitle.trim() || !todoTask}
                            className="flex-1"
                          >
                            {editingId ? "Save Changes" : "Create Todo"}
                          </NokiButton>
                          <NokiButton
                            onClick={() => {
                              setShowAddForm(false);
                              setEditingId("");
                              resetForm();
                            }}
                            variant="negative"
                            size="sm"
                            className="flex-1"
                          >
                            Cancel
                          </NokiButton>
                        </div>
                      </Form>
                    </Card>
                  )}

                  {/* Todos List */}
                  <div className="space-y-2 flex flex-col gap-4">
                    {todos
                      .filter(
                        (todo) =>
                          todoFilter === "all" || todo.type === todoFilter
                      )
                      .map((todo) => {
                        const task = tasks.find((t) => t.id === todo.taskId);
                        const project = allProjects.find(
                          (p) => p.id === todo.projectId
                        );

                        return (
                          <Card
                            key={todo.id}
                            size="small"
                            hoverable
                            className="border border-border/50 hover:border-noki-primary/30 transition-all"
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
                                  <Check size={12} className="text-white" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <h5
                                  className={`font-medium text-sm mb-1 ${
                                    todo.completed
                                      ? "line-through text-muted-foreground"
                                      : "text-foreground"
                                  }`}
                                >
                                  {todo.title}
                                </h5>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mb-2">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs ${
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
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <CalendarOutlined />
                                    {todo.dueDate}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <ClockCircleOutlined />
                                    {todo.dueTime}
                                  </span>
                                </div>
                              </div>

                              {/* Actions aligned to bottom right */}
                              <div className="flex gap-1 mt-auto">
                                <Tooltip title="Edit Todo">
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => handleEditTodo(todo)}
                                    className="text-muted-foreground hover:text-noki-primary"
                                  />
                                </Tooltip>
                                <Tooltip title="Delete Todo">
                                  <Button
                                    type="text"
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() =>
                                      handleDelete(todo.id, "todo")
                                    }
                                  />
                                </Tooltip>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                  </div>

                  {/* Empty State for Todos */}
                  {todos.filter(
                    (todo) => todoFilter === "all" || todo.type === todoFilter
                  ).length === 0 && (
                    <Empty
                      description="No todos yet"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      className="mt-8"
                    >
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setShowAddForm(true)}
                      >
                        Create Your First Todo
                      </Button>
                    </Empty>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
