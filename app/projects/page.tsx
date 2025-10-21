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
} from "lucide-react";
import { useState, useMemo } from "react";
import { ManageProjectsModal } from "@/components/global/manage-projects-modal";

export default function ProjectsPage() {
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

  const assignmentTodos: Record<
    string,
    Array<{ id: string; title: string; completed: boolean }>
  > = {
    "c1-1": [
      { id: "c1-1-t1", title: "Research competitor apps", completed: true },
      { id: "c1-1-t2", title: "Create user personas", completed: false },
      { id: "c1-1-t3", title: "Sketch wireframes", completed: false },
    ],
    "c1-2": [
      { id: "c1-2-t1", title: "Update portfolio website", completed: false },
      { id: "c1-2-t2", title: "Prepare presentation slides", completed: false },
    ],
    "c1-3": [
      { id: "c1-3-t1", title: "Set up Firebase", completed: false },
      { id: "c1-3-t2", title: "Design login screen", completed: false },
      { id: "c1-3-t3", title: "Implement OAuth", completed: false },
    ],
    "c2-1": [
      { id: "c2-1-t1", title: "Select images from shoots", completed: true },
      { id: "c2-1-t2", title: "Edit in Lightroom", completed: false },
      { id: "c2-1-t3", title: "Export final versions", completed: false },
    ],
    "c2-2": [
      { id: "c2-2-t1", title: "Set up studio lights", completed: true },
      { id: "c2-2-t2", title: "Shoot product photos", completed: true },
    ],
    "c2-3": [
      { id: "c2-3-t1", title: "Curate best 50 images", completed: false },
      { id: "c2-3-t2", title: "Write artist statement", completed: false },
    ],
    "c3-1": [
      {
        id: "c3-1-t1",
        title: "Research visual culture theory",
        completed: false,
      },
      { id: "c3-1-t2", title: "Write first draft", completed: false },
    ],
    "c3-2": [
      { id: "c3-2-t1", title: "Visit art gallery", completed: false },
      { id: "c3-2-t2", title: "Analyze 3 artworks", completed: false },
    ],
    "c4-1": [
      { id: "c4-1-t1", title: "Literature review", completed: false },
      { id: "c4-1-t2", title: "Define methodology", completed: false },
    ],
    "c4-2": [
      { id: "c4-2-t1", title: "Brainstorm project ideas", completed: false },
      { id: "c4-2-t2", title: "Write proposal outline", completed: false },
    ],
  };

  const taskTodos: Record<
    string,
    Array<{ id: string; title: string; completed: boolean }>
  > = {
    "p1-1": [
      { id: "p1-1-t1", title: "Create mood board", completed: true },
      { id: "p1-1-t2", title: "Sketch layout options", completed: false },
      { id: "p1-1-t3", title: "Get feedback from peers", completed: false },
    ],
    "p1-2": [
      {
        id: "p1-2-t1",
        title: "Research dark mode best practices",
        completed: true,
      },
      { id: "p1-2-t2", title: "Implement theme toggle", completed: true },
    ],
    "p1-3": [
      { id: "p1-3-t1", title: "Select projects to showcase", completed: false },
      { id: "p1-3-t2", title: "Write project descriptions", completed: false },
    ],
    "p2-1": [
      { id: "p2-1-t1", title: "Sketch user flows", completed: true },
      {
        id: "p2-1-t2",
        title: "Create low-fidelity wireframes",
        completed: true,
      },
    ],
    "p2-2": [
      { id: "p2-2-t1", title: "Install React Native CLI", completed: false },
      { id: "p2-2-t2", title: "Set up project structure", completed: false },
    ],
    "p2-3": [
      { id: "p2-3-t1", title: "Design login screen", completed: false },
      { id: "p2-3-t2", title: "Design signup screen", completed: false },
    ],
    "p3-1": [
      { id: "p3-1-t1", title: "Review all photos", completed: false },
      { id: "p3-1-t2", title: "Narrow down to 40", completed: false },
    ],
    "p3-2": [
      { id: "p3-2-t1", title: "Color correction", completed: false },
      { id: "p3-2-t2", title: "Remove blemishes", completed: false },
    ],
    "p3-3": [
      { id: "p3-3-t1", title: "Choose gallery template", completed: false },
      { id: "p3-3-t2", title: "Arrange photos", completed: false },
    ],
  };

  const personalProjects = [
    {
      id: "1",
      name: "Portfolio Website Redesign",
      color: "bg-noki-primary",
      tasks: [
        {
          id: "p1-1",
          title: "Design new homepage layout",
          completed: false,
          dueDate: "22 Sept",
          description:
            "Create a modern, responsive homepage design that showcases your best work. Focus on clean typography, engaging visuals, and intuitive navigation. The design should reflect your personal brand and make a strong first impression on potential clients and employers.",
        },
        {
          id: "p1-2",
          title: "Implement dark mode",
          completed: true,
          dueDate: "18 Sept",
          description:
            "Add a dark mode toggle to the website with smooth transitions between themes. Ensure all colors have proper contrast ratios and that the dark theme is easy on the eyes for extended viewing periods.",
        },
        {
          id: "p1-3",
          title: "Add project showcase section",
          completed: false,
          dueDate: "29 Sept",
          description:
            "Build an interactive project gallery that highlights your best work with detailed case studies. Include project descriptions, technologies used, challenges faced, and outcomes achieved for each featured project.",
        },
      ],
    },
    {
      id: "2",
      name: "Mobile App Development",
      color: "bg-noki-tertiary",
      tasks: [
        {
          id: "p2-1",
          title: "Create wireframes",
          completed: true,
          dueDate: "15 Sept",
          description:
            "Design low-fidelity wireframes for all main screens of the mobile app. Focus on user flow, information architecture, and ensuring the interface is intuitive and easy to navigate.",
        },
        {
          id: "p2-2",
          title: "Set up React Native project",
          completed: false,
          dueDate: "24 Sept",
          description:
            "Initialize a new React Native project with proper folder structure, navigation setup, and essential dependencies. Configure development environment for both iOS and Android platforms.",
        },
        {
          id: "p2-3",
          title: "Design authentication flow",
          completed: false,
          dueDate: "1 Oct",
          description:
            "Create the complete authentication experience including login, signup, password recovery, and onboarding screens. Ensure the flow is secure, user-friendly, and follows best practices for mobile authentication.",
        },
      ],
    },
    {
      id: "3",
      name: "Photography Portfolio",
      color: "bg-orange-200",
      tasks: [
        {
          id: "p3-1",
          title: "Select best 40 images",
          completed: false,
          dueDate: "20 Sept",
          description:
            "Review your entire photography collection and curate the 40 strongest images that best represent your style and technical skills. Consider variety in subject matter, composition, and lighting.",
        },
        {
          id: "p3-2",
          title: "Edit and retouch photos",
          completed: false,
          dueDate: "27 Sept",
          description:
            "Perform professional editing and retouching on selected images using Lightroom and Photoshop. Ensure consistent color grading, proper exposure, and remove any distracting elements while maintaining a natural look.",
        },
        {
          id: "p3-3",
          title: "Create gallery layout",
          completed: false,
          dueDate: "4 Oct",
          description:
            "Design and build an elegant online gallery to showcase your photography portfolio. The layout should be responsive, load quickly, and allow viewers to appreciate the full quality of your images.",
        },
      ],
    },
    {
      id: "4",
      name: "E-commerce Platform",
      color: "bg-emerald-400",
      tasks: [
        {
          id: "p4-1",
          title: "Design product catalog",
          completed: true,
          dueDate: "16 Sept",
          description:
            "Create a comprehensive product catalog interface with filtering, sorting, and search capabilities. Design product cards that showcase items effectively with high-quality images and clear pricing information.",
        },
        {
          id: "p4-2",
          title: "Implement shopping cart",
          completed: false,
          dueDate: "23 Sept",
          description:
            "Build a fully functional shopping cart system with add/remove items, quantity adjustment, and real-time price calculations. Include persistent cart state and smooth animations for better user experience.",
        },
        {
          id: "p4-3",
          title: "Integrate payment gateway",
          completed: false,
          dueDate: "30 Sept",
          description:
            "Integrate Stripe payment processing with secure checkout flow. Implement order confirmation, email receipts, and proper error handling for failed transactions.",
        },
      ],
    },
    {
      id: "5",
      name: "Fitness Tracking App",
      color: "bg-rose-400",
      tasks: [
        {
          id: "p5-1",
          title: "Design workout logger",
          completed: false,
          dueDate: "19 Sept",
          description:
            "Create an intuitive workout logging interface where users can track exercises, sets, reps, and weights. Include exercise library with instructions and demonstration videos.",
        },
        {
          id: "p5-2",
          title: "Build progress dashboard",
          completed: false,
          dueDate: "26 Sept",
          description:
            "Develop a comprehensive dashboard showing workout history, progress charts, personal records, and achievement badges. Use data visualization to make progress tracking engaging and motivating.",
        },
        {
          id: "p5-3",
          title: "Add social features",
          completed: false,
          dueDate: "3 Oct",
          description:
            "Implement social features including friend connections, workout sharing, and community challenges. Create a feed where users can see and interact with friends' fitness activities.",
        },
      ],
    },
  ];

  const canvasCourses = [
    {
      id: "1",
      name: "Interactive Development 300",
      code: "DV300",
      color: "bg-noki-primary",
      assignments: [
        {
          id: "c1-1",
          title: "Start planning and outlining mobile app",
          dueDate: "21 Sept",
          completed: false,
          description:
            "Begin the initial planning phase for your mobile application project. This includes defining the app's purpose, target audience, core features, and user flows. Create a comprehensive project outline that will guide your development process throughout the semester.",
        },
        {
          id: "c1-2",
          title: "Portfolio Review",
          dueDate: "28 Sept",
          completed: false,
          description:
            "Prepare and present your development portfolio for peer and instructor review. Showcase your best projects, explain your development process, and demonstrate your growth as a developer. Be ready to discuss technical challenges and solutions.",
        },
        {
          id: "c1-3",
          title: "Implement user authentication",
          dueDate: "5 Oct",
          completed: false,
          description:
            "Build a secure user authentication system for your mobile app using modern authentication practices. Implement features like user registration, login, password recovery, and session management. Ensure all user data is properly encrypted and secured.",
        },
      ],
    },
    {
      id: "2",
      name: "Photography 300",
      code: "PH300",
      color: "bg-noki-tertiary",
      assignments: [
        {
          id: "c2-1",
          title: "40 images for commercial portfolio",
          dueDate: "21 Sept",
          completed: false,
          description:
            "Curate and submit 40 professional-quality images suitable for a commercial photography portfolio. Images should demonstrate technical proficiency, creative vision, and commercial viability across various photography genres.",
        },
        {
          id: "c2-2",
          title: "Studio lighting assignment",
          dueDate: "30 Sept",
          completed: true,
          description:
            "Complete a series of studio photographs demonstrating mastery of professional lighting techniques. Experiment with different lighting setups including key, fill, and rim lighting to create various moods and effects.",
        },
        {
          id: "c2-3",
          title: "Final portfolio submission",
          dueDate: "15 Oct",
          completed: false,
          description:
            "Submit your final curated photography portfolio showcasing your best work from the semester. The portfolio should demonstrate technical excellence, artistic vision, and a cohesive personal style that sets you apart as a photographer.",
        },
      ],
    },
    {
      id: "3",
      name: "Visual Culture 300",
      code: "VC300",
      color: "bg-orange-200",
      assignments: [
        {
          id: "c3-1",
          title: "Visual Culture Essay",
          dueDate: "25 Sept",
          completed: false,
          description:
            "Write a comprehensive essay analyzing contemporary visual culture and its impact on society. Explore themes such as representation, identity, and power dynamics in visual media. Support your arguments with relevant theoretical frameworks and examples.",
        },
        {
          id: "c3-2",
          title: "Contemporary art analysis",
          dueDate: "2 Oct",
          completed: false,
          description:
            "Conduct an in-depth analysis of contemporary artworks, examining their cultural context, artistic techniques, and social commentary. Visit galleries, research artists, and develop critical perspectives on current art movements.",
        },
      ],
    },
    {
      id: "4",
      name: "Experimental Learning 300",
      code: "EL300",
      color: "bg-purple-400",
      assignments: [
        {
          id: "c4-1",
          title: "Research methodology paper",
          dueDate: "27 Sept",
          completed: false,
          description:
            "Develop a detailed research methodology paper outlining your approach to experimental learning. Define your research questions, methodology, data collection methods, and analysis framework for your semester project.",
        },
        {
          id: "c4-2",
          title: "Experimental project proposal",
          dueDate: "10 Oct",
          completed: false,
          description:
            "Create a comprehensive proposal for your experimental learning project. Include project objectives, methodology, timeline, expected outcomes, and how the project will contribute to your learning goals and professional development.",
        },
      ],
    },
    {
      id: "5",
      name: "Digital Marketing 200",
      code: "DM200",
      color: "bg-cyan-400",
      assignments: [
        {
          id: "c5-1",
          title: "Social media campaign strategy",
          dueDate: "24 Sept",
          completed: false,
          description:
            "Develop a comprehensive social media marketing campaign for a brand of your choice. Include target audience analysis, content calendar, platform selection, and KPI metrics to measure campaign success.",
        },
        {
          id: "c5-2",
          title: "SEO optimization report",
          dueDate: "1 Oct",
          completed: false,
          description:
            "Conduct a thorough SEO audit of a website and create a detailed optimization report. Identify technical issues, content gaps, and backlink opportunities. Provide actionable recommendations to improve search engine rankings.",
        },
        {
          id: "c5-3",
          title: "Email marketing campaign",
          dueDate: "8 Oct",
          completed: false,
          description:
            "Design and execute an email marketing campaign including audience segmentation, compelling copy, responsive design, and A/B testing strategy. Analyze open rates, click-through rates, and conversion metrics.",
        },
      ],
    },
  ];

  const allItemsSorted = useMemo(() => {
    const allItems: Array<{
      id: string;
      title: string;
      dueDate: string;
      completed: boolean;
      description: string;
      type: "assignment" | "task";
      parentName: string;
      parentColor: string;
      parentCode?: string;
    }> = [];

    // Add all assignments
    canvasCourses.forEach((course) => {
      course.assignments.forEach((assignment) => {
        allItems.push({
          ...assignment,
          type: "assignment",
          parentName: course.name,
          parentColor: course.color,
          parentCode: course.code,
        });
      });
    });

    // Add all tasks
    personalProjects.forEach((project) => {
      project.tasks.forEach((task) => {
        allItems.push({
          ...task,
          type: "task",
          parentName: project.name,
          parentColor: project.color,
        });
      });
    });

    // Sort by due date
    return allItems.sort((a, b) => {
      const dateA = new Date(a.dueDate + " 2024");
      const dateB = new Date(b.dueDate + " 2024");
      return dateA.getTime() - dateB.getTime();
    });
  }, []);

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

  const toggleDescription = (id: string) => {
    setExpandedDescription(expandedDescription === id ? null : id);
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

  const handleCloseModal = () => {
    setIsManageModalOpen(false);
    setEditingItem(null);
    setEditingType(null);
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

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-noki-primary/10 rounded-xl flex items-center justify-center">
            <FolderKanban className="text-noki-primary" size={20} />
          </div>
          <h2 className="text-2xl font-poppins font-semibold text-foreground">
            Personal Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {personalProjects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className={`${project.color} text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden group animate-in fade-in slide-in-from-bottom-2`}
              style={{ animationDelay: `${index * 50}ms` }}
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
                          (project.tasks.filter((t) => t.completed).length /
                            project.tasks.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border"></div>

      <div
        className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-noki-tertiary/10 rounded-xl flex items-center justify-center">
            <BookOpen className="text-noki-tertiary" size={20} />
          </div>
          <h2 className="text-2xl font-poppins font-semibold text-foreground">
            Canvas Courses
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {canvasCourses.map((course, index) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course)}
              className={`${course.color} text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden group animate-in fade-in slide-in-from-bottom-2`}
              style={{ animationDelay: `${index * 50}ms` }}
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
                      {course.assignments.filter((a) => a.completed).length}/
                      {course.assignments.length}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (course.assignments.filter((a) => a.completed)
                            .length /
                            course.assignments.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border"></div>

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

        {viewMode === "grouped" ? (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Assignments Grouped by Course */}
            <div className="space-y-4">
              <h3 className="text-lg font-poppins font-semibold text-foreground">
                Assignments by Course
              </h3>
              <div className="space-y-3">
                {canvasCourses.map((course, courseIndex) => (
                  <NokiCard
                    key={course.id}
                    className={`overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300 border-l-4 ${course.color.replace(
                      "bg-",
                      "border-l-"
                    )}`}
                    style={{ animationDelay: `${courseIndex * 50}ms` }}
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
                            {course.code}
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
                      <div className="mt-2 space-y-0 pl-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                        {course.assignments.map(
                          (assignment, assignmentIndex) => (
                            <div key={assignment.id}>
                              {assignmentIndex > 0 && (
                                <div className="h-px bg-border/30 my-1.5 mx-2" />
                              )}
                              <div
                                className="border border-border/50 rounded-lg overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300"
                                style={{
                                  animationDelay: `${assignmentIndex * 50}ms`,
                                }}
                              >
                                <div className="flex items-center justify-between p-2 bg-muted/10 transition-colors duration-200 hover:bg-muted/20">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div className="flex-1 min-w-0 space-y-1">
                                      <TaskItem
                                        id={assignment.id}
                                        title={assignment.title}
                                        completed={assignment.completed}
                                        onToggle={() => {}}
                                      />
                                      <div className="pl-6">
                                        <p
                                          className={`text-xs text-muted-foreground transition-all duration-300 ${
                                            expandedDescription ===
                                            assignment.id
                                              ? ""
                                              : "line-clamp-3"
                                          }`}
                                        >
                                          {assignment.description}
                                        </p>
                                        <button
                                          onClick={() =>
                                            toggleDescription(assignment.id)
                                          }
                                          className="text-xs text-noki-primary hover:text-noki-primary/80 font-medium mt-1 transition-all duration-200 hover:translate-x-1"
                                        >
                                          {expandedDescription === assignment.id
                                            ? "View less"
                                            : "View more"}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-xs text-muted-foreground">
                                      Due: {assignment.dueDate}
                                    </span>
                                    <button
                                      onClick={() =>
                                        toggleAssignment(assignment.id)
                                      }
                                      className="p-1 hover:bg-muted/50 rounded transition-all duration-200 hover:scale-110"
                                    >
                                      <ChevronRight
                                        className={`text-muted-foreground transition-all duration-300 ${
                                          expandedAssignment === assignment.id
                                            ? "rotate-90 text-noki-primary"
                                            : ""
                                        }`}
                                        size={16}
                                      />
                                    </button>
                                  </div>
                                </div>

                                {expandedAssignment === assignment.id &&
                                  assignmentTodos[assignment.id] && (
                                    <div className="bg-muted/5 p-2 space-y-1 pl-2.5 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-border/30">
                                      <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
                                        Todos
                                      </p>
                                      {assignmentTodos[assignment.id].map(
                                        (todo, todoIndex) => (
                                          <div
                                            key={todo.id}
                                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/20 rounded transition-all duration-200 animate-in fade-in slide-in-from-left-1 hover:translate-x-1"
                                            style={{
                                              animationDelay: `${
                                                todoIndex * 30
                                              }ms`,
                                            }}
                                          >
                                            <TaskItem
                                              id={todo.id}
                                              title={todo.title}
                                              completed={todo.completed}
                                              onToggle={() => {}}
                                            />
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </NokiCard>
                ))}
              </div>
            </div>

            <div className="border-t border-border my-6"></div>

            {/* Personal Tasks Grouped by Project */}
            <div className="space-y-4">
              <h3 className="text-lg font-poppins font-semibold text-foreground">
                Tasks by Personal Project
              </h3>
              <div className="space-y-3">
                {personalProjects.map((project, projectIndex) => (
                  <NokiCard
                    key={project.id}
                    className={`overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300 border-l-4 ${project.color.replace(
                      "bg-",
                      "border-l-"
                    )}`}
                    style={{ animationDelay: `${projectIndex * 50}ms` }}
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
                      <div className="mt-2 space-y-0 pl-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                        {project.tasks.map((task, taskIndex) => (
                          <div key={task.id}>
                            {taskIndex > 0 && (
                              <div className="h-px bg-border/30 my-1.5 mx-2" />
                            )}
                            <div
                              className="border border-border/50 rounded-lg overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300"
                              style={{ animationDelay: `${taskIndex * 50}ms` }}
                            >
                              <div className="flex items-center justify-between p-2 bg-muted/10 transition-colors duration-200 hover:bg-muted/20">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="flex-1 min-w-0 space-y-1">
                                    <TaskItem
                                      id={task.id}
                                      title={task.title}
                                      completed={task.completed}
                                      onToggle={() => {}}
                                    />
                                    <div className="pl-6">
                                      <p
                                        className={`text-xs text-muted-foreground transition-all duration-300 ${
                                          expandedDescription === task.id
                                            ? ""
                                            : "line-clamp-3"
                                        }`}
                                      >
                                        {task.description}
                                      </p>
                                      <button
                                        onClick={() =>
                                          toggleDescription(task.id)
                                        }
                                        className="text-xs text-noki-primary hover:text-noki-primary/80 font-medium mt-1 transition-all duration-200 hover:translate-x-1"
                                      >
                                        {expandedDescription === task.id
                                          ? "View less"
                                          : "View more"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-xs text-muted-foreground">
                                    Due: {task.dueDate}
                                  </span>
                                  <button
                                    onClick={() => toggleTask(task.id)}
                                    className="p-1 hover:bg-muted/50 rounded transition-all duration-200 hover:scale-110"
                                  >
                                    <ChevronRight
                                      className={`text-muted-foreground transition-all duration-300 ${
                                        expandedTask === task.id
                                          ? "rotate-90 text-noki-primary"
                                          : ""
                                      }`}
                                      size={16}
                                    />
                                  </button>
                                </div>
                              </div>

                              {expandedTask === task.id &&
                                taskTodos[task.id] && (
                                  <div className="bg-muted/5 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-border/50">
                                    <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
                                      Todos
                                    </p>
                                    {taskTodos[task.id].map(
                                      (todo, todoIndex) => (
                                        <div
                                          key={todo.id}
                                          className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/20 rounded transition-all duration-200 animate-in fade-in slide-in-from-left-1 hover:translate-x-1"
                                          style={{
                                            animationDelay: `${
                                              todoIndex * 30
                                            }ms`,
                                          }}
                                        >
                                          <TaskItem
                                            id={todo.id}
                                            title={todo.title}
                                            completed={todo.completed}
                                            onToggle={() => {}}
                                          />
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </NokiCard>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500">
            {allItemsSorted.map((item, itemIndex) => (
              <NokiCard
                key={item.id}
                className={`overflow-hidden animate-in fade-in slide-in-from-right-2 duration-300 border-l-4 ${item.parentColor.replace(
                  "bg-",
                  "border-l-"
                )}`}
                style={{ animationDelay: `${itemIndex * 30}ms` }}
              >
                <div className="flex items-center justify-between p-2 transition-colors duration-200 hover:bg-muted/10 px-0 py-0">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <TaskItem
                          id={item.id}
                          title={item.title}
                          completed={item.completed}
                          onToggle={() => {}}
                        />
                      </div>
                      <div className="pl-6 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">{item.parentName}</span>
                        {item.parentCode && (
                          <>
                            <span>•</span>
                            <span>{item.parentCode}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="capitalize">{item.type}</span>
                      </div>
                      <div className="pl-6">
                        <p
                          className={`text-xs text-muted-foreground transition-all duration-300 ${
                            expandedDescription === item.id
                              ? ""
                              : "line-clamp-3"
                          }`}
                        >
                          {item.description}
                        </p>
                        <button
                          onClick={() => toggleDescription(item.id)}
                          className="text-xs text-noki-primary hover:text-noki-primary/80 font-medium mt-1 transition-all duration-200 hover:translate-x-1"
                        >
                          {expandedDescription === item.id
                            ? "View less"
                            : "View more"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Show todos when expanded */}
                  {((item.type === "assignment" &&
                    expandedAssignment === item.id &&
                    assignmentTodos[item.id]) ||
                    (item.type === "task" &&
                      expandedTask === item.id &&
                      taskTodos[item.id])) && (
                    <div className="bg-muted/5 p-2 space-y-1 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
                        Todos
                      </p>
                      {(item.type === "assignment"
                        ? assignmentTodos[item.id]
                        : taskTodos[item.id]
                      )?.map((todo, todoIndex) => (
                        <div
                          key={todo.id}
                          className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/20 rounded transition-all duration-200 animate-in fade-in slide-in-from-left-1 hover:translate-x-1"
                          style={{ animationDelay: `${todoIndex * 30}ms` }}
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
              </NokiCard>
            ))}
          </div>
        )}
      </div>

      {/* Manage Projects Modal */}
      <ManageProjectsModal
        isOpen={isManageModalOpen}
        onClose={handleCloseModal}
        editingItem={editingItem}
        editingType={editingType}
      />
    </div>
  );
}
