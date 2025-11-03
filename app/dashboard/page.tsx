"use client";
import {
  Calendar,
  FolderKanban,
  Sparkles,
  TrendingUp,
  Clock,
  Plus,
  Target,
  Zap,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { ManageProjectsModal } from "@/components/global/manage-projects-modal";
import { useMain } from "@/services/hooks/useMain";
import { utcToLocalDateString } from "@/lib/timezone-config";

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

interface Course {
  id: string;
  name: string;
  code: string;
  colorHex: string | null;
}

interface Assignment {
  title: string;
  dueDate: string;
  subject: string;
  taskId: string;
}

interface DashboardProject {
  id: string;
  name: string;
  status: string;
  colorHex: string | null;
}

export default function DashboardPage() {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const { getDB } = useMain();

  // Data State
  const [personalProjects, setPersonalProjects] = useState<Project[]>([]);
  const [canvasCourses, setCanvasCourses] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from IndexedDB
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const db = getDB();
        await db.init();

        const [fetchedProjects, fetchedTasks, fetchedTodos] = await Promise.all(
          [db.getProjects(), db.getTasks(), db.getTodos()]
        );

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

        // Separate by source
        const personal = projectsWithTasks.filter(
          (p) => p.source === "Personal"
        );
        const canvas = projectsWithTasks.filter((p) => p.source === "Canvas");

        setPersonalProjects(personal);
        setCanvasCourses(canvas);
      } catch (error) {
        console.error("[Dashboard Page] Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Helper function to format date for display
  const formatDueDate = (dueDate: string | null): string => {
    if (!dueDate) return "No date";

    try {
      const localDateStr = utcToLocalDateString(dueDate);
      const date = new Date(localDateStr);
      const day = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      return `${day} ${month}`;
    } catch (error) {
      console.error("[Dashboard Page] Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Transform courses for display
  const courses: Course[] = useMemo(() => {
    return canvasCourses.slice(0, 5).map((course) => {
      return {
        id: course.id,
        name: course.name,
        code: course.courseCode || "N/A",
        colorHex: course.colorHex,
      };
    });
  }, [canvasCourses]);

  // Transform assignments for display (upcoming incomplete tasks from Canvas)
  const assignments: Assignment[] = useMemo(() => {
    const allAssignments: Array<{
      title: string;
      dueDate: string;
      dueDateObj: Date | null;
      subject: string;
      taskId: string;
    }> = [];

    canvasCourses.forEach((course) => {
      course.tasks
        .filter((task) => !task.completed && task.dueDate)
        .forEach((task) => {
          let dueDateObj: Date | null = null;
          try {
            if (task.dueDate) {
              const localDateStr = utcToLocalDateString(task.dueDate);
              dueDateObj = new Date(localDateStr);
            }
          } catch (error) {
            console.error("[Dashboard] Error parsing date:", error);
          }

          allAssignments.push({
            title: task.title,
            dueDate: formatDueDate(task.dueDate),
            dueDateObj,
            subject: course.courseCode || "N/A",
            taskId: task.id,
          });
        });
    });

    // Sort by due date (earliest first) and take first 4
    return allAssignments
      .sort((a, b) => {
        if (!a.dueDateObj && !b.dueDateObj) return 0;
        if (!a.dueDateObj) return 1;
        if (!b.dueDateObj) return -1;
        return a.dueDateObj.getTime() - b.dueDateObj.getTime();
      })
      .slice(0, 4)
      .map(({ dueDateObj, ...rest }) => rest);
  }, [canvasCourses]);

  // Transform projects for display
  const projects: DashboardProject[] = useMemo(() => {
    return personalProjects.slice(0, 3).map((project) => {
      // Determine status based on task completion
      const completedTasks = project.tasks.filter((t) => t.completed).length;
      const totalTasks = project.tasks.length;
      let status = "Planning";
      if (totalTasks > 0) {
        const completionRate = completedTasks / totalTasks;
        if (completionRate === 1) {
          status = "Complete";
        } else if (completionRate >= 0.5) {
          status = "In Progress";
        } else if (completionRate > 0) {
          status = "Started";
        }
      }

      return {
        id: project.id,
        name: project.name,
        status,
        colorHex: project.colorHex,
      };
    });
  }, [personalProjects]);

  // Calculate stats
  const stats = useMemo(() => {
    // Calculate completion rate from all tasks (Canvas + Personal)
    const allTasks = [
      ...canvasCourses.flatMap((c) => c.tasks),
      ...personalProjects.flatMap((p) => p.tasks),
    ];
    const completedTasks = allTasks.filter((t) => t.completed).length;
    const totalTasks = allTasks.length;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Active projects count
    const activeProjects = personalProjects.length;

    return {
      completionRate,
      activeProjects,
    };
  }, [canvasCourses, personalProjects]);

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl h-64 bg-gradient-to-br from-noki-primary via-noki-tertiary to-purple-600 border-2 border-white/10">
        <img
          src="/cute-teal-character-in-landscape-with-clouds-and-t.jpg"
          alt="Noki character in landscape"
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="text-white space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="text-yellow-300" size={20} />
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                Keep it up!
              </span>
            </div>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl">
              Hi username, Noki is proud of you!
            </h1>
            <p className="font-poppins text-base text-white/90">
              You're making amazing progress. Ready to kickstart your day?
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
        {/* Upcoming Tasks - Large card spanning 2 columns and 2 rows */}
        <div className="md:col-span-2 md:row-span-2 bg-card border-2 border-border p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-noki-tertiary/10 rounded-xl flex items-center justify-center">
                <Target className="text-noki-tertiary" size={20} />
              </div>
              <div className="text-xl font-poppins font-bold text-foreground">
                Upcoming Tasks
              </div>
            </div>
            <button className="text-xs text-noki-primary hover:text-noki-primary/80 font-semibold transition-colors">
              View all →
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading assignments...
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming assignments
              </div>
            ) : (
              assignments.map((assignment, index) => (
                <div
                  key={index}
                  className="bg-background p-4 rounded-2xl border-l-4 border-noki-tertiary hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-poppins font-bold text-xs text-noki-primary bg-noki-primary/10 px-2.5 py-1 rounded-lg">
                          {assignment.subject}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={12} />
                          {assignment.dueDate}
                        </span>
                      </div>
                      <div className="text-foreground font-medium text-sm group-hover:text-noki-primary transition-colors line-clamp-2">
                        {assignment.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats Card 1 - Completion Rate */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 border-white/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={20} />
              <span className="text-xs font-semibold">This Week</span>
            </div>
            <div className="text-4xl font-bold mb-1">
              {isLoading ? "..." : `${stats.completionRate}%`}
            </div>
            <div className="text-sm text-white/90">Completion Rate</div>
          </div>
        </div>

        {/* Stats Card 2 - Active Projects */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 border-white/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <FolderKanban size={20} />
              <span className="text-xs font-semibold">Active</span>
            </div>
            <div className="text-4xl font-bold mb-1">
              {isLoading ? "..." : stats.activeProjects}
            </div>
            <div className="text-sm text-white/90">Projects</div>
          </div>
        </div>

        {/* Quick Actions - Spanning 2 columns */}
        <div className="md:col-span-2 bg-card border-2 border-border p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-noki-primary/10 rounded-xl flex items-center justify-center">
              <Zap className="text-noki-primary" size={20} />
            </div>
            <div className="text-xl font-poppins font-bold text-foreground">
              Quick Actions
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/timetable" className="block">
              <button className="w-full h-full group bg-background hover:bg-purple-500/10 border-2 border-border hover:border-purple-500 p-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md aspect-square px-3.5 py-3.5">
                <div className="flex flex-col items-center justify-center gap-3 text-center h-full">
                  <div className="w-14 h-14 bg-purple-500/10 group-hover:bg-purple-500 rounded-xl flex items-center justify-center transition-colors">
                    <Calendar
                      className="text-purple-500 group-hover:text-white transition-colors"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-foreground mb-1 text-sm">
                      View Calendar
                    </h3>
                  </div>
                </div>
              </button>
            </Link>

            <button
              onClick={() => setIsManageModalOpen(true)}
              className="w-full h-full group bg-background hover:bg-blue-500/20 border-2 border-border hover:border-blue-500 p-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md aspect-square px-3.5 py-3.5"
            >
              <div className="flex flex-col items-center justify-center gap-3 text-center h-full">
                <div className="w-14 h-14 bg-blue-500/10 group-hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors">
                  <FolderKanban
                    className="text-blue-500 group-hover:text-white transition-colors"
                    size={24}
                  />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-foreground mb-1 text-sm">
                    Manage Projects, Tasks & Todos
                  </h3>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Courses Section with Link wrapper */}
        <div className="md:col-span-2 bg-card border-2 border-border p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Image
                  src="/essentials/canvas_icon_white.png"
                  alt="Canvas"
                  width={20}
                  height={20}
                />
              </div>
              <div className="text-xl font-poppins font-bold text-foreground">
                Courses
              </div>
            </div>
            <Link href="/projects">
              <button className="text-xs text-noki-primary hover:text-noki-primary/80 font-semibold transition-colors">
                View all →
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {isLoading ? (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                Loading courses...
              </div>
            ) : courses.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                No courses found
              </div>
            ) : (
              courses.map((course) => (
                <Link key={course.id} href="/projects">
                  <div className="aspect-square">
                    <div
                      className="text-white p-4 rounded-2xl shadow-md relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-2 border-white/20 h-full flex flex-col justify-end"
                      style={{
                        backgroundColor: course.colorHex || "#6366f1",
                      }}
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="relative z-10">
                        <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold inline-block mb-2">
                          {course.code}
                        </span>
                        <h3 className="font-poppins font-bold text-sm leading-tight line-clamp-2">
                          {course.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Projects Section with Link wrapper */}
        <div className="md:col-span-2 bg-card border-2 border-border p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <FolderKanban className="text-orange-500" size={20} />
              </div>
              <div className="text-xl font-poppins font-bold text-foreground">
                Projects
              </div>
            </div>
            <Link href="/projects">
              <button className="text-xs text-noki-primary hover:text-noki-primary/80 font-semibold transition-colors">
                View all →
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {isLoading ? (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <>
                <div className="aspect-square">
                  <button
                    onClick={() => setIsManageModalOpen(true)}
                    className="bg-background hover:bg-blue-500/20 border-2 border-dashed border-border hover:border-blue-500 p-4 rounded-2xl transition-all duration-300 group h-full w-full flex items-center justify-center"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-blue-500 transition-colors">
                      <Plus size={16} />
                      <span className="font-semibold text-xs">New Project</span>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <>
                {projects.map((project) => (
                  <Link key={project.id} href="/projects">
                    <div className="aspect-square">
                      <div
                        className="text-white p-4 rounded-2xl shadow-md relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-2 border-white/20 h-full flex flex-col justify-end"
                        style={{
                          backgroundColor: project.colorHex || "#6366f1",
                        }}
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                          <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold inline-block mb-2">
                            {project.status}
                          </span>
                          <h3 className="font-poppins font-bold text-sm leading-tight line-clamp-2">
                            {project.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                <div className="aspect-square">
                  <button
                    onClick={() => setIsManageModalOpen(true)}
                    className="bg-background hover:bg-blue-500/20 border-2 border-dashed border-border hover:border-blue-500 p-4 rounded-2xl transition-all duration-300 group h-full w-full flex items-center justify-center"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-blue-500 transition-colors">
                      <Plus size={16} />
                      <span className="font-semibold text-xs">New Project</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Timeline - Full width spanning all columns */}
      </div>

      <ManageProjectsModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        initialTab="projects"
      />
    </div>
  );
}
