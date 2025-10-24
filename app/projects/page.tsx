"use client";

import { NokiCard } from "@/components/global/noki-card";
import { TaskItem } from "@/components/global/task-item";
import {
  FolderKanban,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { ManageProjectsModal } from "@/components/global/manage-projects-modal";
import { useMain } from "@/services/hooks/useMain";
import { utcToLocalDateString } from "@/lib/timezone-config";
import { Select } from "antd";

const { Option } = Select;

// Type definitions
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  description: string | null;
  projectId: string;
  todos: Todo[];
}

interface Project {
  id: string;
  name: string;
  colorHex: string | null;
  source: "Canvas" | "Personal";
  courseCode?: string | null;
  tasks: Task[];
}

export default function ProjectsPage() {
  console.log("[Projects Page] Component rendering");

  const { getDB } = useMain();

  // UI State
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(
    null
  );
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [expandedDescription, setExpandedDescription] = useState<string | null>(
    null
  );
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grouped" | "all">("grouped");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<"project" | "course" | null>(
    null
  );

  // Sorting and Filtering State for "All" view
  const [sortBy, setSortBy] = useState<"date-asc" | "date-desc">("date-asc");
  const [filterBy, setFilterBy] = useState<
    "all" | "complete" | "incomplete" | "overdue"
  >("all");

  // Data State
  const [personalProjects, setPersonalProjects] = useState<Project[]>([]);
  const [canvasCourses, setCanvasCourses] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("[Projects Page] State:", {
    personalProjectsCount: personalProjects.length,
    canvasCoursesCount: canvasCourses.length,
    isLoading,
  });

  // Helper function to format date for display
  const formatDueDate = (dueDate: string | null): string => {
    if (!dueDate) return "No date";

    try {
      const localDateStr = utcToLocalDateString(dueDate);
      const date = new Date(localDateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error(
        "[Projects Page] Error formatting date:",
        error,
        "dueDate:",
        dueDate
      );
      return "Invalid date";
    }
  };

  // Helper function to check if an item is overdue
  const isOverdue = (dueDate: string | null, isCompleted: boolean): boolean => {
    if (!dueDate || isCompleted) return false;

    try {
      const localDateStr = utcToLocalDateString(dueDate);
      const itemDate = new Date(localDateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      itemDate.setHours(0, 0, 0, 0);

      return itemDate < today;
    } catch (error) {
      return false;
    }
  };

  // Fetch data from IndexedDB
  useEffect(() => {
    console.log("[Projects Page] useEffect triggered!");

    const fetchData = async () => {
      setIsLoading(true);
      console.log("[Projects Page] fetchData started");

      try {
        const db = getDB();
        console.log("[Projects Page] Got DB instance");
        await db.init();
        console.log("[Projects Page] DB initialized");

        console.log("[Projects Page] Fetching data from IndexedDB...");

        const [fetchedProjects, fetchedTasks, fetchedTodos] = await Promise.all(
          [db.getProjects(), db.getTasks(), db.getTodos()]
        );

        console.log("[Projects Page] Fetched data:", {
          projects: fetchedProjects.length,
          tasks: fetchedTasks.length,
          todos: fetchedTodos.length,
        });

        // Log samples
        if (fetchedProjects.length > 0) {
          console.log("[Projects Page] Sample project:", fetchedProjects[0]);
        }
        if (fetchedTasks.length > 0) {
          console.log("[Projects Page] Sample task:", fetchedTasks[0]);
        }
        if (fetchedTodos.length > 0) {
          console.log("[Projects Page] Sample todo:", fetchedTodos[0]);
        }

        // Transform data to structured format
        const projectsWithTasks: Project[] = fetchedProjects.map(
          (proj: any) => {
            // Get all tasks for this project
            const projectTasks = fetchedTasks
              .filter((task: any) => task.project_id === proj.id)
              .map((task: any) => {
                // Get all todos for this task
                const taskTodos = fetchedTodos
                  .filter((todo: any) => todo.task_id === task.id)
                  .map((todo: any) => ({
                    id: todo.id,
                    title: todo.title || todo.name || "Untitled Todo",
                    completed: todo.is_completed || false,
                    taskId: task.id,
                  }));

                return {
                  id: task.id,
                  title: task.title || task.name || "Untitled Task",
                  completed: task.is_submitted || false,
                  dueDate: task.due_date || null,
                  description: task.description || null,
                  projectId: proj.id,
                  todos: taskTodos,
                };
              });

            return {
              id: proj.id,
              name: proj.title || proj.name || "Untitled Project",
              colorHex: proj.color_hex || null,
              source: proj.source as "Canvas" | "Personal",
              courseCode: proj.source === "Canvas" ? proj.course_code : null,
              tasks: projectTasks,
            };
          }
        );

        console.log(
          "[Projects Page] Structured projects:",
          projectsWithTasks.length
        );

        // Separate by source
        const personal = projectsWithTasks.filter(
          (p) => p.source === "Personal"
        );
        const canvas = projectsWithTasks.filter((p) => p.source === "Canvas");

        console.log("[Projects Page] Split data:", {
          personal: personal.length,
          canvas: canvas.length,
        });

        setPersonalProjects(personal);
        setCanvasCourses(canvas);

        console.log(
          "[Projects Page] Data loaded successfully (Timezone: UTC+2)"
        );
      } catch (error) {
        console.error("[Projects Page] Error fetching data:", error);
      } finally {
        setIsLoading(false);
        console.log("[Projects Page] Loading complete");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const allItemsSorted = useMemo(() => {
    const allItems: Array<{
      id: string;
      title: string;
      dueDate: string | null;
      completed: boolean;
      description: string | null;
      type: "assignment" | "task";
      parentName: string;
      parentColorHex: string | null;
      parentCode?: string | null;
      todos: Todo[];
    }> = [];

    // Add all Canvas assignments (tasks from Canvas courses)
    canvasCourses.forEach((course) => {
      course.tasks.forEach((task) => {
        allItems.push({
          id: task.id,
          title: task.title,
          dueDate: task.dueDate,
          completed: task.completed,
          description: task.description,
          type: "assignment",
          parentName: course.name,
          parentColorHex: course.colorHex,
          parentCode: course.courseCode,
          todos: task.todos,
        });
      });
    });

    // Add all personal project tasks
    personalProjects.forEach((project) => {
      project.tasks.forEach((task) => {
        allItems.push({
          id: task.id,
          title: task.title,
          dueDate: task.dueDate,
          completed: task.completed,
          description: task.description,
          type: "task",
          parentName: project.name,
          parentColorHex: project.colorHex,
          todos: task.todos,
        });
      });
    });

    // Apply filters
    let filteredItems = allItems;

    if (filterBy === "complete") {
      filteredItems = allItems.filter((item) => item.completed);
    } else if (filterBy === "incomplete") {
      filteredItems = allItems.filter((item) => !item.completed);
    } else if (filterBy === "overdue") {
      filteredItems = allItems.filter((item) =>
        isOverdue(item.dueDate, item.completed)
      );
    }

    // Apply sorting
    return filteredItems.sort((a, b) => {
      // Handle items without dates
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      if (sortBy === "date-asc") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
  }, [canvasCourses, personalProjects, sortBy, filterBy, isOverdue]);

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const toggleProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const toggleAssignment = (assignmentId: string) => {
    setExpandedAssignment(
      expandedAssignment === assignmentId ? null : assignmentId
    );
  };

  const toggleTask = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const toggleDescription = (itemId: string) => {
    setExpandedDescription(expandedDescription === itemId ? null : itemId);
  };

  const handleProjectClick = (project: any) => {
    setEditingItem(project);
    setEditingType("project");
    setIsManageModalOpen(true);
  };

  const handleCourseClick = (course: any) => {
    setEditingItem(course);
    setEditingType("course");
    setIsManageModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-poppins font-bold text-foreground">
            Projects
          </h1>
          <p className="text-muted-foreground">
            Manage your personal projects and course assignments
          </p>
        </div>

        {/* Manage Button */}
        <button
          onClick={() => setIsManageModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-noki-primary hover:bg-noki-primary/90 text-white rounded-xl font-medium transition-colors shadow-lg shadow-noki-primary/20"
        >
          <Plus size={18} />
          <span>Manage</span>
        </button>
      </div>

      <div className="border-t border-border"></div>

      {/* Personal Projects - ALWAYS SHOWN */}
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-noki-primary/10 rounded-xl flex items-center justify-center">
            <FolderKanban className="text-noki-primary" size={20} />
          </div>
          <div className="text-2xl font-poppins font-semibold text-foreground">
            Personal Projects
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Loading projects...
            </div>
          ) : personalProjects.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No personal projects found
            </div>
          ) : (
            personalProjects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden group animate-in fade-in slide-in-from-bottom-2"
                style={{
                  animationDelay: `${index * 50}ms`,
                  backgroundColor: project.colorHex || "#6366f1",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="font-poppins font-bold text-lg mb-3 leading-tight flex-1 line-clamp-2">
                    {project.name}
                  </h3>
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-90">Progress</span>
                      <span className="font-semibold">
                        {project.tasks.filter((t) => t.completed).length}/
                        {project.tasks.length}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            project.tasks.length > 0
                              ? (project.tasks.filter((t) => t.completed)
                                  .length /
                                  project.tasks.length) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-border"></div>

      {/* Canvas Courses - ALWAYS SHOWN */}
      <div
        className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-noki-tertiary/10 rounded-xl flex items-center justify-center">
            <Image
              src="/essentials/canvas_icon_white.png"
              alt="Canvas"
              width={20}
              height={20}
            />
          </div>
          <div className="text-2xl font-poppins font-semibold text-foreground ">
            Canvas Courses
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Loading courses...
            </div>
          ) : canvasCourses.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No Canvas courses found
            </div>
          ) : (
            canvasCourses.map((course, index) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden group animate-in fade-in slide-in-from-bottom-2"
                style={{
                  animationDelay: `${index * 50}ms`,
                  backgroundColor: course.colorHex || "#10b981",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 right-3 z-20"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="font-poppins font-bold text-base leading-tight pr-16 mb-3 flex-1 line-clamp-2">
                    {course.name}
                  </h3>
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-90">Completed</span>
                      <span className="font-semibold">
                        {course.tasks.filter((t) => t.completed).length}/
                        {course.tasks.length}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            course.tasks.length > 0
                              ? (course.tasks.filter((t) => t.completed)
                                  .length /
                                  course.tasks.length) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-border"></div>

      {/* All Work Section - ALWAYS SHOWN */}
      <div
        className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-poppins font-semibold text-foreground">
            All Work
          </h2>
          <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grouped")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                viewMode === "grouped"
                  ? "bg-noki-primary text-white shadow-sm scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <LayoutGrid
                size={16}
                className="transition-transform duration-300"
              />
              <span>Grouped</span>
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                viewMode === "all"
                  ? "bg-noki-primary text-white shadow-sm scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <List size={16} className="transition-transform duration-300" />
              <span>All</span>
            </button>
          </div>
        </div>

        {/* View Mode: Grouped - Shows tasks organized by project */}
        {viewMode === "grouped" ? (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : (
              <div className="space-y-6">
                {/* Canvas Assignments Grouped by Course */}
                {canvasCourses.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-poppins font-semibold text-foreground">
                      Assignments by Course
                    </h3>
                    <div className="space-y-3">
                      {canvasCourses.map((course) => (
                        <NokiCard
                          key={course.id}
                          className="overflow-hidden border-l-4"
                          style={{
                            borderLeftColor: course.colorHex || "#10b981",
                          }}
                        >
                          <button
                            onClick={() => toggleCourse(course.id)}
                            className="w-full flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-all duration-300"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <h3 className="font-poppins font-semibold text-sm text-foreground">
                                  {course.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {course.courseCode}
                                </p>
                              </div>
                            </div>
                            <ChevronDown
                              className={`text-muted-foreground transition-all duration-300 ${
                                expandedCourse === course.id
                                  ? "rotate-180 text-noki-primary"
                                  : ""
                              }`}
                              size={18}
                            />
                          </button>

                          {expandedCourse === course.id && (
                            <div className="mt-2 space-y-2 pl-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                              {course.tasks.length === 0 ? (
                                <p className="text-sm text-muted-foreground px-2 py-4">
                                  No tasks yet
                                </p>
                              ) : (
                                course.tasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className="border border-border/50 rounded-lg overflow-hidden"
                                  >
                                    <div className="flex items-center justify-between p-2 bg-muted/10">
                                      <div className="flex-1 min-w-0 space-y-1">
                                        <TaskItem
                                          id={task.id}
                                          title={task.title}
                                          completed={task.completed}
                                          onToggle={() => {}}
                                        />
                                        {task.description && (
                                          <div className="pl-6">
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                              {task.description}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs text-muted-foreground">
                                          {formatDueDate(task.dueDate)}
                                        </span>
                                      </div>
                                    </div>
                                    {task.todos && task.todos.length > 0 && (
                                      <div className="bg-muted/5 p-2 space-y-1 border-t border-border/30">
                                        <p className="text-xs font-medium text-muted-foreground px-2">
                                          Subtasks (
                                          {
                                            task.todos.filter(
                                              (t) => t.completed
                                            ).length
                                          }
                                          /{task.todos.length})
                                        </p>
                                        {task.todos.map((todo) => (
                                          <div
                                            key={todo.id}
                                            className="px-2 py-1"
                                          >
                                            <TaskItem
                                              id={todo.id}
                                              title={todo.title}
                                              completed={todo.completed}
                                              onToggle={() => {}}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </NokiCard>
                      ))}
                    </div>
                  </div>
                )}

                {canvasCourses.length > 0 && personalProjects.length > 0 && (
                  <div className="border-t border-border my-6"></div>
                )}

                {/* Personal Tasks Grouped by Project */}
                {personalProjects.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-poppins font-semibold text-foreground">
                      Tasks by Personal Project
                    </h3>
                    <div className="space-y-3">
                      {personalProjects.map((project) => (
                        <NokiCard
                          key={project.id}
                          className="overflow-hidden border-l-4"
                          style={{
                            borderLeftColor: project.colorHex || "#6366f1",
                          }}
                        >
                          <button
                            onClick={() => toggleProject(project.id)}
                            className="w-full flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-all duration-300"
                          >
                            <div className="flex items-center gap-3">
                              <h3 className="font-poppins font-semibold text-sm text-foreground">
                                {project.name}
                              </h3>
                            </div>
                            <ChevronDown
                              className={`text-muted-foreground transition-all duration-300 ${
                                expandedProject === project.id
                                  ? "rotate-180 text-noki-primary"
                                  : ""
                              }`}
                              size={18}
                            />
                          </button>

                          {expandedProject === project.id && (
                            <div className="mt-2 space-y-2 pl-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                              {project.tasks.length === 0 ? (
                                <p className="text-sm text-muted-foreground px-2 py-4">
                                  No tasks yet
                                </p>
                              ) : (
                                project.tasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className="border border-border/50 rounded-lg overflow-hidden"
                                  >
                                    <div className="flex items-center justify-between p-2 bg-muted/10">
                                      <div className="flex-1 min-w-0 space-y-1">
                                        <TaskItem
                                          id={task.id}
                                          title={task.title}
                                          completed={task.completed}
                                          onToggle={() => {}}
                                        />
                                        {task.description && (
                                          <div className="pl-6">
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                              {task.description}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs text-muted-foreground">
                                          {formatDueDate(task.dueDate)}
                                        </span>
                                      </div>
                                    </div>
                                    {task.todos && task.todos.length > 0 && (
                                      <div className="bg-muted/5 p-2 space-y-1 border-t border-border/30">
                                        <p className="text-xs font-medium text-muted-foreground px-2">
                                          Subtasks (
                                          {
                                            task.todos.filter(
                                              (t) => t.completed
                                            ).length
                                          }
                                          /{task.todos.length})
                                        </p>
                                        {task.todos.map((todo) => (
                                          <div
                                            key={todo.id}
                                            className="px-2 py-1"
                                          >
                                            <TaskItem
                                              id={todo.id}
                                              title={todo.title}
                                              completed={todo.completed}
                                              onToggle={() => {}}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </NokiCard>
                      ))}
                    </div>
                  </div>
                )}

                {canvasCourses.length === 0 &&
                  personalProjects.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No projects or tasks found
                    </div>
                  )}
              </div>
            )}
          </div>
        ) : (
          /* View Mode: All - Shows all tasks in a flat list */
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Sorting and Filtering Controls */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Filter:
                  </span>
                  <Select
                    value={filterBy}
                    onChange={(value) =>
                      setFilterBy(
                        value as "all" | "complete" | "incomplete" | "overdue"
                      )
                    }
                    style={{ minWidth: 150 }}
                    size="middle"
                  >
                    <Option value="all">All Tasks</Option>
                    <Option value="incomplete">Incomplete</Option>
                    <Option value="complete">Complete</Option>
                    <Option value="overdue">Overdue</Option>
                  </Select>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Sort:
                  </span>
                  <Select
                    value={sortBy}
                    onChange={(value) =>
                      setSortBy(value as "date-asc" | "date-desc")
                    }
                    style={{ minWidth: 180 }}
                    size="middle"
                  >
                    <Option value="date-asc">Due Date (Earliest)</Option>
                    <Option value="date-desc">Due Date (Latest)</Option>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <span>
                    <span className="font-semibold text-foreground">
                      {allItemsSorted.length}
                    </span>{" "}
                    {allItemsSorted.length === 1 ? "task" : "tasks"}
                    {filterBy !== "all" && (
                      <span className="ml-1 px-2 py-0.5 rounded-md bg-noki-primary/10 text-noki-primary text-xs font-medium">
                        {filterBy}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : allItemsSorted.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {filterBy === "all"
                  ? "No tasks found"
                  : `No ${filterBy} tasks found`}
              </div>
            ) : (
              <div className="space-y-3">
                {allItemsSorted.map((item, index) => {
                  const itemIsOverdue = isOverdue(item.dueDate, item.completed);

                  return (
                    <div
                      key={item.id}
                      className={`bg-card/50 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                        itemIsOverdue
                          ? "border-red-500/50 hover:shadow-red-500/20 hover:shadow-lg"
                          : "border-border hover:shadow-lg"
                      }`}
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{
                            backgroundColor: itemIsOverdue
                              ? "#ef4444"
                              : item.parentColorHex || "#6366f1",
                          }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3
                                  className={`font-semibold truncate ${
                                    itemIsOverdue
                                      ? "text-red-500"
                                      : "text-foreground"
                                  }`}
                                >
                                  {item.title}
                                </h3>
                                {itemIsOverdue && (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-500 rounded-md border border-red-500/20">
                                    Overdue
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                                <span className="px-2 py-0.5 rounded-md bg-secondary/50">
                                  {item.parentName}
                                </span>
                                {item.parentCode && (
                                  <span className="text-xs">
                                    {item.parentCode}
                                  </span>
                                )}
                                <span>•</span>
                                <span
                                  className={
                                    itemIsOverdue
                                      ? "text-red-500 font-medium"
                                      : ""
                                  }
                                >
                                  {formatDueDate(item.dueDate)}
                                </span>
                                {item.todos && item.todos.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      {
                                        item.todos.filter((t) => t.completed)
                                          .length
                                      }
                                      /{item.todos.length} subtasks
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            {item.completed && (
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manage Projects Modal */}
      <ManageProjectsModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setEditingItem(null);
          setEditingType(null);
        }}
        editingItem={editingItem}
        editingType={editingType}
      />
    </div>
  );
}
