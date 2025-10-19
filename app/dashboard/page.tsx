"use client"
import { TimelineComponent } from "@/components/global/timeline-component"
import { Calendar, FolderKanban, Sparkles, TrendingUp, Clock, Plus } from "lucide-react"

export default function DashboardPage() {
  const courses = [
    { id: "1", name: "Interactive Development 300", code: "DV300", color: "bg-noki-primary" },
    { id: "2", name: "Photography 300", code: "PH300", color: "bg-noki-tertiary" },
    { id: "3", name: "Visual Culture 300", code: "VC300", color: "bg-orange-200" },
    { id: "4", name: "Experimental Learning 300", code: "PH300", color: "bg-noki-tertiary" },
    { id: "5", name: "Interactive Development Portfolio 300", code: "DV300", color: "bg-noki-primary" },
  ]

  const assignments = [
    { title: "40 images for commercial portfolio", dueDate: "21 Sept", subject: "PH300" },
    { title: "Start your planning and outlining of your mobile app", dueDate: "21 Sept", subject: "DV300" },
    { title: "Visual Culture Essay", dueDate: "25 Sept", subject: "VC300" },
    { title: "Portfolio Review", dueDate: "28 Sept", subject: "DV300" },
  ]

  const projects = [
    { id: "1", name: "Mobile App Prototype", status: "In Progress", color: "bg-blue-500" },
    { id: "2", name: "Photography Portfolio", status: "Review", color: "bg-purple-500" },
    { id: "3", name: "Visual Culture Research", status: "Planning", color: "bg-orange-500" },
  ]

  const timelineEvents = [
    {
      id: "1",
      title: "Weekly Project Review",
      startTime: "09:00",
      endTime: "12:00",
      participants: ["A", "B"],
      color: "bg-blue-500",
    },
    {
      id: "2",
      title: "User Testing and Feedback",
      startTime: "09:30",
      endTime: "12:30",
      participants: ["C", "D"],
      color: "bg-green-500",
    },
    {
      id: "3",
      title: "Collaboration Session",
      startTime: "10:30",
      endTime: "13:30",
      participants: ["E", "F"],
      color: "bg-purple-500",
    },
    {
      id: "4",
      title: "Content Creation",
      startTime: "14:30",
      endTime: "17:00",
      participants: ["G"],
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Hero Welcome Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl h-72 bg-gradient-to-br from-noki-primary via-noki-tertiary to-purple-500 border border-white/10">
        <img
          src="/cute-teal-character-in-landscape-with-clouds-and-t.jpg"
          alt="Noki character in landscape"
          className="w-full h-full object-cover opacity-70 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="text-white space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-yellow-300" size={24} />
              <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                Keep it up!
              </span>
            </div>
            <h1 className="font-poppins font-bold text-4xl">Hi Ruan, Noki is proud of you!</h1>
            <p className="font-poppins text-lg text-white/90">
              You're making amazing progress. Ready to kickstart your day?
            </p>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions - Single Bubble */}
        <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-bold text-foreground">Quick Actions</h2>
          </div>

          <div className="space-y-3">
            <button className="w-full group bg-background hover:bg-noki-primary/10 border-2 border-border hover:border-noki-primary p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-noki-primary/10 group-hover:bg-noki-primary rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <FolderKanban className="text-noki-primary group-hover:text-white transition-colors" size={22} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-poppins font-bold text-base text-foreground mb-0.5">Manage Projects</h3>
                  <p className="text-xs text-muted-foreground">View and organize all your work</p>
                </div>
              </div>
            </button>

            <button className="w-full group bg-background hover:bg-noki-tertiary/10 border-2 border-border hover:border-noki-tertiary p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-noki-tertiary/10 group-hover:bg-noki-tertiary rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <Plus className="text-noki-tertiary group-hover:text-white transition-colors" size={22} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-poppins font-bold text-base text-foreground mb-0.5">Create Task</h3>
                  <p className="text-xs text-muted-foreground">Add new items quickly</p>
                </div>
              </div>
            </button>

            <button className="w-full group bg-background hover:bg-purple-500/10 border-2 border-border hover:border-purple-500 p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 group-hover:bg-purple-500 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <Calendar className="text-purple-500 group-hover:text-white transition-colors" size={22} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-poppins font-bold text-base text-foreground mb-0.5">View Calendar</h3>
                  <p className="text-xs text-muted-foreground">Check your schedule</p>
                </div>
              </div>
            </button>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-5 rounded-2xl shadow-md border border-white/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} />
                  <span className="text-xs font-medium">This Week</span>
                </div>
                <div className="text-3xl font-bold mb-0.5">87%</div>
                <div className="text-xs text-white/80">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks - Single Bubble */}
        <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-bold text-foreground">Upcoming Tasks</h2>
            <button className="text-sm text-noki-primary hover:text-noki-primary/80 font-medium transition-colors">
              View all →
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map((assignment, index) => (
              <div
                key={index}
                className="bg-background p-4 rounded-2xl border-l-4 border-noki-tertiary hover:shadow-md transition-all duration-200 cursor-pointer group"
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
            ))}
          </div>
        </div>

        {/* Your Courses - Single Bubble */}
        <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-bold text-foreground">Your Courses</h2>
            <button className="text-sm text-noki-primary hover:text-noki-primary/80 font-medium transition-colors">
              View all →
            </button>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`${course.color} text-white p-5 rounded-2xl shadow-md relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-white/20`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold inline-block mb-2">
                      {course.code}
                    </span>
                    <h3 className="font-poppins font-bold text-base leading-tight line-clamp-2">{course.name}</h3>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FolderKanban size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Projects - Single Bubble */}
        <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-bold text-foreground">Your Projects</h2>
            <button className="text-sm text-noki-primary hover:text-noki-primary/80 font-medium transition-colors">
              View all →
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-background border-2 border-border p-5 rounded-2xl hover:shadow-md transition-all duration-300 cursor-pointer group hover:border-noki-primary"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-3 h-3 rounded-full ${project.color} flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-poppins font-bold text-base text-foreground group-hover:text-noki-primary transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{project.status}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-background border-2 border-border group-hover:bg-noki-primary/10 group-hover:border-noki-primary rounded-xl flex items-center justify-center flex-shrink-0 transition-all">
                    <FolderKanban
                      className="text-muted-foreground group-hover:text-noki-primary transition-colors"
                      size={18}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button className="w-full bg-background hover:bg-noki-primary/10 border-2 border-dashed border-border hover:border-noki-primary p-5 rounded-2xl transition-all duration-300 group">
              <div className="flex items-center justify-center gap-2 text-muted-foreground group-hover:text-noki-primary transition-colors">
                <Plus size={18} />
                <span className="font-medium text-sm">Create New Project</span>
              </div>
            </button>
          </div>
        </div>

        {/* Timeline - Full Width */}
        <div className="lg:col-span-2">
          <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-lg">
            <TimelineComponent events={timelineEvents} date="September 27, 2023" />
          </div>
        </div>
      </div>
    </div>
  )
}
