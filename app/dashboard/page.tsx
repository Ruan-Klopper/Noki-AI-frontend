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
import { useState } from "react";
import { ManageProjectsModal } from "@/components/global/manage-projects-modal";

export default function DashboardPage() {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const courses = [
    {
      id: "1",
      name: "Interactive Development 300",
      code: "DV300",
      color: "bg-noki-primary",
    },
    {
      id: "2",
      name: "Photography 300",
      code: "PH300",
      color: "bg-noki-tertiary",
    },
    {
      id: "3",
      name: "Visual Culture 300",
      code: "VC300",
      color: "bg-orange-200",
    },
    {
      id: "4",
      name: "Experimental Learning 300",
      code: "PH300",
      color: "bg-noki-tertiary",
    },
    {
      id: "5",
      name: "Interactive Development Portfolio 300",
      code: "DV300",
      color: "bg-noki-primary",
    },
  ];

  const assignments = [
    {
      title: "40 images for commercial portfolio",
      dueDate: "21 Sept",
      subject: "PH300",
    },
    {
      title: "Start your planning and outlining of your mobile app",
      dueDate: "21 Sept",
      subject: "DV300",
    },
    { title: "Visual Culture Essay", dueDate: "25 Sept", subject: "VC300" },
    { title: "Portfolio Review", dueDate: "28 Sept", subject: "DV300" },
  ];

  const projects = [
    {
      id: "1",
      name: "Mobile App Prototype",
      status: "In Progress",
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Photography Portfolio",
      status: "Review",
      color: "bg-purple-500",
    },
    {
      id: "3",
      name: "Visual Culture Research",
      status: "Planning",
      color: "bg-orange-500",
    },
  ];

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
  ];

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
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="text-yellow-300" size={20} />
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                Keep it up!
              </span>
            </div>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl">
              Hi Ruan, Noki is proud of you!
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
              <h2 className="text-xl font-poppins font-bold text-foreground">
                Upcoming Tasks
              </h2>
            </div>
            <button className="text-xs text-noki-primary hover:text-noki-primary/80 font-semibold transition-colors">
              View all →
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {assignments.map((assignment, index) => (
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
            ))}
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
            <div className="text-4xl font-bold mb-1">87%</div>
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
            <div className="text-4xl font-bold mb-1">{projects.length}</div>
            <div className="text-sm text-white/90">Projects</div>
          </div>
        </div>

        {/* Quick Actions - Spanning 2 columns */}
        <div className="md:col-span-2 bg-card border-2 border-border p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-noki-primary/10 rounded-xl flex items-center justify-center">
              <Zap className="text-noki-primary" size={20} />
            </div>
            <h2 className="text-xl font-poppins font-bold text-foreground">
              Quick Actions
            </h2>
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
                <BookOpen className="text-blue-500" size={20} />
              </div>
              <h2 className="text-xl font-poppins font-bold text-foreground">
                Courses
              </h2>
            </div>
            <Link href="/projects">
              <button className="text-xs text-noki-primary hover:text-noki-primary/80 font-semibold transition-colors">
                View all →
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {courses.map((course) => (
              <Link key={course.id} href="/projects">
                <div className="aspect-square">
                  <div
                    className={`${course.color} text-white p-4 rounded-2xl shadow-md relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-2 border-white/20 h-full flex flex-col justify-end`}
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
            ))}
          </div>
        </div>

        {/* Projects Section with Link wrapper */}
        <div className="md:col-span-2 bg-card border-2 border-border p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <FolderKanban className="text-orange-500" size={20} />
              </div>
              <h2 className="text-xl font-poppins font-bold text-foreground">
                Projects
              </h2>
            </div>
            <Link href="/projects">
              <button className="text-xs text-noki-primary hover:text-noki-primary/80 font-semibold transition-colors">
                View all →
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {projects.map((project) => (
              <Link key={project.id} href="/projects">
                <div className="aspect-square">
                  <div
                    className={`${project.color} text-white p-4 rounded-2xl shadow-md relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-2 border-white/20 h-full flex flex-col justify-end`}
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
