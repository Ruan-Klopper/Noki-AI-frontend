"use client"
import {
  Send,
  Paperclip,
  Calendar,
  FileText,
  HelpCircle,
  Clock,
  Zap,
  BookOpen,
  FolderKanban,
  X,
  Check,
  Sparkles,
} from "lucide-react"
import { useSidenav } from "@/components/global/sidenav-context"
import { useState, useRef, useEffect } from "react"

interface Course {
  id: string
  name: string
  code: string
  color: string
}

interface Project {
  id: string
  name: string
  color: string
}

interface Assignment {
  id: string
  title: string
  courseId: string
  courseName: string
}

interface Task {
  id: string
  title: string
  projectId: string
  projectName: string
}

export function ChatInterface() {
  const { isSidenavCollapsed, isRightSidenavCollapsed } = useSidenav()
  const [inputValue, setInputValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"quick" | "courses" | "projects">("quick")

  const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([])
  const [selectedAssignments, setSelectedAssignments] = useState<Assignment[]>([])
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([])

  const courses: Course[] = [
    { id: "1", name: "Interactive Development 300", code: "DV300", color: "bg-noki-primary" },
    { id: "2", name: "Photography 300", code: "PH300", color: "bg-noki-tertiary" },
    { id: "3", name: "Visual Culture 300", code: "VC300", color: "bg-orange-200" },
    { id: "4", name: "Experimental Learning 300", code: "EL300", color: "bg-purple-400" },
    { id: "5", name: "Digital Marketing 200", code: "DM200", color: "bg-cyan-400" },
  ]

  const projects: Project[] = [
    { id: "1", name: "Portfolio Website Redesign", color: "bg-noki-primary" },
    { id: "2", name: "Mobile App Development", color: "bg-noki-tertiary" },
    { id: "3", name: "Photography Portfolio", color: "bg-orange-200" },
    { id: "4", name: "E-commerce Platform", color: "bg-emerald-400" },
    { id: "5", name: "Fitness Tracking App", color: "bg-rose-400" },
  ]

  const assignments: Assignment[] = [
    {
      id: "c1-1",
      title: "Start planning and outlining mobile app",
      courseId: "1",
      courseName: "Interactive Development 300",
    },
    { id: "c1-2", title: "Portfolio Review", courseId: "1", courseName: "Interactive Development 300" },
    { id: "c2-1", title: "40 images for commercial portfolio", courseId: "2", courseName: "Photography 300" },
    { id: "c3-1", title: "Visual Culture Essay", courseId: "3", courseName: "Visual Culture 300" },
  ]

  const tasks: Task[] = [
    { id: "p1-1", title: "Design new homepage layout", projectId: "1", projectName: "Portfolio Website Redesign" },
    { id: "p1-2", title: "Implement dark mode", projectId: "1", projectName: "Portfolio Website Redesign" },
    { id: "p2-1", title: "Create wireframes", projectId: "2", projectName: "Mobile App Development" },
    { id: "p3-1", title: "Select best 40 images", projectId: "3", projectName: "Photography Portfolio" },
  ]

  const quickActions = [
    { icon: Calendar, label: "How does my schedule look?", color: "text-blue-400" },
    { icon: Clock, label: "Create a new timetable", color: "text-purple-400" },
    { icon: FileText, label: "Explain assignment", color: "text-green-400" },
    { icon: HelpCircle, label: "Study tips", color: "text-orange-400" },
    { icon: BookOpen, label: "Summarize course content", color: "text-cyan-400" },
    { icon: FolderKanban, label: "Show project progress", color: "text-pink-400" },
  ]

  const toggleCourse = (course: Course) => {
    setSelectedCourses((prev) => {
      const exists = prev.find((c) => c.id === course.id)
      if (exists) {
        // Remove course and its assignments
        setSelectedAssignments((prevAssignments) => prevAssignments.filter((a) => a.courseId !== course.id))
        return prev.filter((c) => c.id !== course.id)
      } else {
        return [...prev, course]
      }
    })
  }

  const toggleProject = (project: Project) => {
    setSelectedProjects((prev) => {
      const exists = prev.find((p) => p.id === project.id)
      if (exists) {
        // Remove project and its tasks
        setSelectedTasks((prevTasks) => prevTasks.filter((t) => t.projectId !== project.id))
        return prev.filter((p) => p.id !== project.id)
      } else {
        return [...prev, project]
      }
    })
  }

  const toggleAssignment = (assignment: Assignment) => {
    setSelectedAssignments((prev) => {
      const exists = prev.find((a) => a.id === assignment.id)
      if (exists) {
        return prev.filter((a) => a.id !== assignment.id)
      } else {
        return [...prev, assignment]
      }
    })
  }

  const toggleTask = (task: Task) => {
    setSelectedTasks((prev) => {
      const exists = prev.find((t) => t.id === task.id)
      if (exists) {
        return prev.filter((t) => t.id !== task.id)
      } else {
        return [...prev, task]
      }
    })
  }

  const removeCourse = (courseId: string) => {
    setSelectedCourses((prev) => prev.filter((c) => c.id !== courseId))
    setSelectedAssignments((prev) => prev.filter((a) => a.courseId !== courseId))
  }

  const removeProject = (projectId: string) => {
    setSelectedProjects((prev) => prev.filter((p) => p.id !== projectId))
    setSelectedTasks((prev) => prev.filter((t) => t.projectId !== projectId))
  }

  const removeAssignment = (assignmentId: string) => {
    setSelectedAssignments((prev) => prev.filter((a) => a.id !== assignmentId))
  }

  const removeTask = (taskId: string) => {
    setSelectedTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const openDrawer = (tab: "quick" | "courses" | "projects") => {
    setActiveTab(tab)
    setIsContextDrawerOpen(true)
  }

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`
    }
  }, [inputValue])

  return (
    <div
      className={`fixed bottom-0 right-0 transition-all duration-300 ${
        isSidenavCollapsed ? "left-0 md:left-16" : "left-0 md:left-64"
      } ${isRightSidenavCollapsed ? "right-0 md:right-16" : "right-0 md:right-80"}`}
    >
      {isContextDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
            onClick={() => setIsContextDrawerOpen(false)}
          />
          <div className="absolute bottom-full left-0 right-0 mb-2 z-50 animate-in slide-in-from-bottom-4 duration-300 flex justify-center">
            <div className="w-full max-w-[700px] mx-5">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl border border-gray-700/80 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header with Tabs */}
                <div className="border-b border-gray-700/50 bg-gray-900/50 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-poppins font-bold text-white flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-noki-primary" />
                      Add Context
                    </h3>
                    <button
                      onClick={() => setIsContextDrawerOpen(false)}
                      className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab("quick")}
                      className={`flex-1 px-4 py-2.5 rounded-xl font-roboto font-medium text-sm transition-all duration-200 ${
                        activeTab === "quick"
                          ? "bg-noki-primary text-white shadow-lg"
                          : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                      }`}
                    >
                      <Zap className="h-4 w-4 inline mr-2" />
                      Quick Actions
                    </button>
                    <button
                      onClick={() => setActiveTab("courses")}
                      className={`flex-1 px-4 py-2.5 rounded-xl font-roboto font-medium text-sm transition-all duration-200 ${
                        activeTab === "courses"
                          ? "bg-noki-tertiary text-white shadow-lg"
                          : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                      }`}
                    >
                      <BookOpen className="h-4 w-4 inline mr-2" />
                      Courses
                      {selectedCourses.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                          {selectedCourses.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("projects")}
                      className={`flex-1 px-4 py-2.5 rounded-xl font-roboto font-medium text-sm transition-all duration-200 ${
                        activeTab === "projects"
                          ? "bg-noki-primary text-white shadow-lg"
                          : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                      }`}
                    >
                      <FolderKanban className="h-4 w-4 inline mr-2" />
                      Projects
                      {selectedProjects.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                          {selectedProjects.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 max-h-[50vh] overflow-y-auto">
                  {/* Quick Actions Tab */}
                  {activeTab === "quick" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setInputValue(action.label)
                            setIsContextDrawerOpen(false)
                          }}
                          className="flex items-center gap-3 p-4 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700/40 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] group"
                        >
                          <div className={`p-2 rounded-lg bg-gray-900/50 ${action.color}`}>
                            <action.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          </div>
                          <span className="text-sm text-gray-200 font-roboto">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Courses Tab */}
                  {activeTab === "courses" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* Course Selection */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-poppins font-semibold text-gray-400 uppercase tracking-wide mb-3">
                          Select Courses
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {courses.map((course) => {
                            const isSelected = selectedCourses.some((c) => c.id === course.id)
                            return (
                              <button
                                key={course.id}
                                onClick={() => toggleCourse(course)}
                                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:scale-[1.01] shadow-lg ${
                                  isSelected
                                    ? `${course.color} text-white border-2 border-white/30`
                                    : `${course.color} text-white opacity-70 hover:opacity-100 border-2 border-transparent`
                                }`}
                              >
                                <div className="flex items-center justify-center w-5 h-5 rounded border-2 border-white/50 bg-white/10">
                                  {isSelected && <Check className="h-3.5 w-3.5" />}
                                </div>
                                <BookOpen className="h-4 w-4" />
                                <div className="flex-1">
                                  <div className="font-poppins font-semibold text-sm">{course.name}</div>
                                  <div className="text-xs opacity-90">{course.code}</div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Assignment Selection */}
                      {selectedCourses.length > 0 && (
                        <div className="space-y-2 pt-4 border-t border-gray-700/50">
                          <h4 className="text-sm font-poppins font-semibold text-gray-400 uppercase tracking-wide mb-3">
                            Select Assignments
                          </h4>
                          {selectedCourses.map((course) => {
                            const courseAssignments = assignments.filter((a) => a.courseId === course.id)
                            if (courseAssignments.length === 0) return null
                            return (
                              <div key={course.id} className="space-y-2">
                                <p className="text-xs text-gray-500 font-roboto">{course.name}</p>
                                {courseAssignments.map((assignment) => {
                                  const isSelected = selectedAssignments.some((a) => a.id === assignment.id)
                                  return (
                                    <button
                                      key={assignment.id}
                                      onClick={() => toggleAssignment(assignment)}
                                      className={`flex items-center gap-3 p-2.5 rounded-lg text-left transition-all duration-200 w-full ${
                                        isSelected
                                          ? "bg-blue-600 text-white"
                                          : "bg-gray-800/60 text-gray-300 hover:bg-gray-700/80"
                                      }`}
                                    >
                                      <div className="flex items-center justify-center w-4 h-4 rounded border border-white/30 bg-white/10">
                                        {isSelected && <Check className="h-3 w-3" />}
                                      </div>
                                      <FileText className="h-3.5 w-3.5" />
                                      <span className="text-xs font-roboto flex-1">{assignment.title}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Projects Tab */}
                  {activeTab === "projects" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* Project Selection */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-poppins font-semibold text-gray-400 uppercase tracking-wide mb-3">
                          Select Projects
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {projects.map((project) => {
                            const isSelected = selectedProjects.some((p) => p.id === project.id)
                            return (
                              <button
                                key={project.id}
                                onClick={() => toggleProject(project)}
                                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:scale-[1.01] shadow-lg ${
                                  isSelected
                                    ? `${project.color} text-white border-2 border-white/30`
                                    : `${project.color} text-white opacity-70 hover:opacity-100 border-2 border-transparent`
                                }`}
                              >
                                <div className="flex items-center justify-center w-5 h-5 rounded border-2 border-white/50 bg-white/10">
                                  {isSelected && <Check className="h-3.5 w-3.5" />}
                                </div>
                                <FolderKanban className="h-4 w-4" />
                                <div className="font-poppins font-semibold text-sm flex-1">{project.name}</div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Task Selection */}
                      {selectedProjects.length > 0 && (
                        <div className="space-y-2 pt-4 border-t border-gray-700/50">
                          <h4 className="text-sm font-poppins font-semibold text-gray-400 uppercase tracking-wide mb-3">
                            Select Tasks
                          </h4>
                          {selectedProjects.map((project) => {
                            const projectTasks = tasks.filter((t) => t.projectId === project.id)
                            if (projectTasks.length === 0) return null
                            return (
                              <div key={project.id} className="space-y-2">
                                <p className="text-xs text-gray-500 font-roboto">{project.name}</p>
                                {projectTasks.map((task) => {
                                  const isSelected = selectedTasks.some((t) => t.id === task.id)
                                  return (
                                    <button
                                      key={task.id}
                                      onClick={() => toggleTask(task)}
                                      className={`flex items-center gap-3 p-2.5 rounded-lg text-left transition-all duration-200 w-full ${
                                        isSelected
                                          ? "bg-green-600 text-white"
                                          : "bg-gray-800/60 text-gray-300 hover:bg-gray-700/80"
                                      }`}
                                    >
                                      <div className="flex items-center justify-center w-4 h-4 rounded border border-white/30 bg-white/10">
                                        {isSelected && <Check className="h-3 w-3" />}
                                      </div>
                                      <FileText className="h-3.5 w-3.5" />
                                      <span className="text-xs font-roboto flex-1">{task.title}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Chatbar Container */}
      <div className="px-5 py-5 pb-8 md:px-10 md:py-6 bg-gradient-to-t from-gray-900 via-gray-900 via-50% to-transparent">
        <div className="max-w-[900px] mx-auto flex items-center flex-col">
          <div className="w-full mb-4 space-y-3 flex flex-col items-center">
            {/* Action Buttons - centered */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => openDrawer("quick")}
                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-noki-primary/20 to-blue-500/20 backdrop-blur-sm border border-noki-primary/40 rounded-full text-sm font-roboto font-medium text-noki-primary hover:bg-noki-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-noki-primary/30 hover:scale-105"
              >
                <Zap className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Quick Actions
              </button>

              <button
                onClick={() => openDrawer("courses")}
                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-noki-tertiary/20 to-purple-500/20 backdrop-blur-sm border border-noki-tertiary/40 rounded-full text-sm font-roboto font-medium text-noki-tertiary hover:bg-noki-tertiary hover:text-white transition-all duration-300 shadow-lg hover:shadow-noki-tertiary/30 hover:scale-105"
              >
                <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Courses
                {selectedCourses.length > 0 && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                    {selectedCourses.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => openDrawer("projects")}
                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-500/40 rounded-full text-sm font-roboto font-medium text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 hover:scale-105"
              >
                <FolderKanban className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Projects
                {selectedProjects.length > 0 && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                    {selectedProjects.length}
                  </span>
                )}
              </button>
            </div>

            {/* Selected Items Display - centered and organized */}
            {(selectedCourses.length > 0 ||
              selectedProjects.length > 0 ||
              selectedAssignments.length > 0 ||
              selectedTasks.length > 0) && (
              <div className="flex flex-wrap gap-2 justify-center animate-in fade-in slide-in-from-top-2 duration-300 max-w-3xl">
                {selectedCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`flex items-center gap-2 px-3 py-1.5 ${course.color} text-white rounded-full text-sm font-medium shadow-lg animate-in fade-in zoom-in-95 duration-300`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{course.code}</span>
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {selectedProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`flex items-center gap-2 px-3 py-1.5 ${project.color} text-white rounded-full text-sm font-medium shadow-lg animate-in fade-in zoom-in-95 duration-300`}
                  >
                    <FolderKanban className="h-3.5 w-3.5" />
                    <span className="max-w-[150px] truncate">{project.name}</span>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {selectedAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs font-medium shadow-lg animate-in fade-in zoom-in-95 duration-300"
                  >
                    <FileText className="h-3 w-3" />
                    <span className="max-w-[150px] truncate">{assignment.title}</span>
                    <button
                      onClick={() => removeAssignment(assignment.id)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}

                {selectedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-medium shadow-lg animate-in fade-in zoom-in-95 duration-300"
                  >
                    <FileText className="h-3 w-3" />
                    <span className="max-w-[150px] truncate">{task.title}</span>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Chat Input */}
          <div className="w-full">
            <div className="relative group/chatbar">
              {/* Animated gradient border glow */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-noki-primary/40 via-blue-500/40 to-noki-primary/40 rounded-[26px] opacity-0 group-hover/chatbar:opacity-100 transition-opacity duration-500 blur-sm animate-pulse"></div>

              <div className="relative bg-gradient-to-br from-gray-800 to-gray-850 border border-gray-700/80 rounded-[25px] shadow-2xl hover:shadow-noki-primary/10 transition-all duration-300 backdrop-blur-md overflow-hidden">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-noki-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover/chatbar:opacity-100 transition-opacity duration-500"></div>

                <div className="relative flex p-3 gap-3 items-center">
                  {/* Attachment Button */}
                  <button className="flex-shrink-0 p-2.5 rounded-full text-gray-400 hover:text-noki-primary hover:bg-noki-primary/10 transition-all duration-200 group/attach self-center">
                    <Paperclip className="h-5 w-5 group-hover/attach:rotate-12 transition-transform" />
                  </button>

                  {/* Input Area - perfectly centered */}
                  <div className="flex-1 relative flex items-center py-1">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask Noki anything..."
                      className="w-full bg-transparent resize-none focus:outline-none text-gray-100 placeholder-gray-500 font-roboto text-base leading-relaxed px-2 max-h-32 overflow-y-auto"
                      rows={1}
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#4B5563 transparent",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          // Handle send message
                        }
                      }}
                    />
                    <style jsx>{`
                      textarea::-webkit-scrollbar {
                        width: 4px;
                      }
                      textarea::-webkit-scrollbar-track {
                        background: transparent;
                      }
                      textarea::-webkit-scrollbar-thumb {
                        background: #4B5563;
                        border-radius: 2px;
                      }
                      textarea::-webkit-scrollbar-thumb:hover {
                        background: #6B7280;
                      }
                    `}</style>
                  </div>

                  {/* Send Button */}
                  <button className="flex-shrink-0 relative group/send self-center">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-noki-primary to-blue-600 rounded-full opacity-0 group-hover/send:opacity-100 transition-opacity duration-300 blur-md"></div>

                    {/* Button */}
                    <div className="relative bg-gradient-to-r from-noki-primary to-blue-600 p-3 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
                      <Send className="h-5 w-5 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer Text */}
              <p className="text-center text-xs text-gray-500 mt-3 font-roboto">
                Noki can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
