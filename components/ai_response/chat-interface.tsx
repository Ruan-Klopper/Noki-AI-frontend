"use client";
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
} from "lucide-react";
import { useSidenav } from "@/components/global/sidenav-context";
import { useState, useRef, useEffect, useCallback } from "react";
import { useConversationContext } from "@/services/ai/conversation-context";
import { useAI } from "@/services/hooks";
import { useMain } from "@/services/hooks/useMain";
import { ConversationMessage, Conversation } from "@/services/types";

interface Project {
  id: string;
  title: string;
  color_hex?: string;
  source?: string;
  course_code?: string;
}

interface Task {
  id: string;
  title: string;
  project_id?: string;
  project?: Project;
}

export function ChatInterface() {
  const { isSidenavCollapsed, isRightSidenavCollapsed } = useSidenav();
  const {
    activeConversationId,
    setActiveConversationId,
    addMessage,
    refreshMessages,
    addConversation,
  } = useConversationContext();
  const { chat, newConversation, loading: aiLoading } = useAI();
  const { getDB } = useMain();
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"quick" | "projects">("quick");

  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

  // Data loaded from IndexedDB
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Use ref to prevent concurrent loads and track if we've loaded data
  const isLoadingRef = useRef(false);
  const lastLoadedKeyRef = useRef<string>("");

  // Load projects and tasks from IndexedDB when drawer opens for projects tab
  useEffect(() => {
    // Early return if conditions aren't met
    if (!isContextDrawerOpen || activeTab !== "projects") {
      // Reset when drawer closes or tab changes
      isLoadingRef.current = false;
      lastLoadedKeyRef.current = "";
      return;
    }

    // Create a unique key for this combination of drawer state and tab
    const loadKey = `${isContextDrawerOpen}-${activeTab}`;

    // Skip if we've already loaded for this exact state
    if (lastLoadedKeyRef.current === loadKey) {
      return;
    }

    // Prevent concurrent loads
    if (isLoadingRef.current) {
      return;
    }

    let isMounted = true;
    isLoadingRef.current = true;
    lastLoadedKeyRef.current = loadKey;

    const loadProjectsAndTasks = async () => {
      setIsLoadingProjects(true);
      try {
        const db = getDB();
        await db.init();
        const [fetchedProjects, fetchedTasks] = await Promise.all([
          db.getProjects(),
          db.getTasks(),
        ]);

        if (!isMounted) return;

        // Transform projects to match our interface
        const transformedProjects: Project[] = fetchedProjects.map(
          (p: any) => ({
            id: p.id,
            title: p.title || p.name || "Untitled Project",
            color_hex: p.color_hex || p.color,
            source: p.source,
            course_code: p.course_code,
          })
        );

        // Transform tasks to match our interface
        const transformedTasks: Task[] = fetchedTasks.map((t: any) => {
          const taskProject = fetchedProjects.find(
            (p: any) => p.id === t.project_id
          );
          return {
            id: t.id,
            title: t.title || "Untitled Task",
            project_id: t.project_id,
            project: taskProject
              ? {
                  id: taskProject.id,
                  title: taskProject.title || taskProject.name || "Untitled",
                  color_hex: taskProject.color_hex || taskProject.color,
                  source: taskProject.source,
                  course_code: taskProject.course_code,
                }
              : undefined,
          };
        });

        setProjects(transformedProjects);
        setTasks(transformedTasks);
      } catch (error) {
        console.error("Error loading projects and tasks:", error);
      } finally {
        if (isMounted) {
          isLoadingRef.current = false;
          setIsLoadingProjects(false);
        }
      }
    };

    loadProjectsAndTasks();

    return () => {
      isMounted = false;
      isLoadingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContextDrawerOpen, activeTab]); // getDB is stable, no need in deps

  // Helper function to get color class from color_hex
  const getColorClass = (colorHex?: string): string => {
    if (!colorHex) return "bg-noki-primary";
    // If it's a hex color, we'll use inline styles
    if (colorHex.startsWith("#")) {
      return ""; // Will use inline style instead
    }
    return colorHex;
  };

  // Helper function to get inline style for hex colors
  const getColorStyle = (colorHex?: string): { backgroundColor?: string } => {
    if (colorHex && colorHex.startsWith("#")) {
      return { backgroundColor: colorHex };
    }
    return {};
  };

  const quickActions = [
    {
      icon: Calendar,
      label: "How does my schedule look?",
      color: "text-blue-400",
    },
    { icon: Clock, label: "Create a new timetable", color: "text-purple-400" },
    { icon: FileText, label: "Explain assignment", color: "text-green-400" },
    { icon: HelpCircle, label: "Study tips", color: "text-orange-400" },
    {
      icon: BookOpen,
      label: "Summarize course content",
      color: "text-cyan-400",
    },
    {
      icon: FolderKanban,
      label: "Show project progress",
      color: "text-pink-400",
    },
  ];

  const toggleProject = (project: Project) => {
    setSelectedProjects((prev) => {
      const exists = prev.find((p) => p.id === project.id);
      if (exists) {
        // Remove project and its tasks
        setSelectedTasks((prevTasks) =>
          prevTasks.filter((t) => t.project_id !== project.id)
        );
        return prev.filter((p) => p.id !== project.id);
      } else {
        return [...prev, project];
      }
    });
  };

  const toggleTask = (task: Task) => {
    setSelectedTasks((prev) => {
      const exists = prev.find((t) => t.id === task.id);
      if (exists) {
        return prev.filter((t) => t.id !== task.id);
      } else {
        return [...prev, task];
      }
    });
  };

  const removeProject = (projectId: string) => {
    setSelectedProjects((prev) => prev.filter((p) => p.id !== projectId));
    setSelectedTasks((prev) => prev.filter((t) => t.project_id !== projectId));
  };

  const removeTask = (taskId: string) => {
    setSelectedTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const openDrawer = (tab: "quick" | "projects") => {
    setActiveTab(tab);
    setIsContextDrawerOpen(true);
  };

  /**
   * Handle sending a message
   */
  const handleSendMessage = async () => {
    const prompt = inputValue.trim();
    if (!prompt || isSending || aiLoading) return;

    // If no active conversation, create one first
    let conversationId = activeConversationId;
    if (!conversationId) {
      setIsSending(true);
      try {
        const convResponse = await newConversation();
        if (!convResponse?.success || !convResponse.data.conversation_id) {
          console.error("Failed to create conversation");
          setIsSending(false);
          return;
        }
        conversationId = convResponse.data.conversation_id;
        setActiveConversationId(conversationId);

        // Add to conversations list
        const newConv: Conversation = {
          id: conversationId,
          title: `New Conversation - ${new Date().toLocaleDateString()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          message_count: 0,
        };
        addConversation(newConv);
      } catch (error) {
        console.error("Error creating conversation:", error);
        setIsSending(false);
        return;
      } finally {
        setIsSending(false);
      }
    }

    // Add user message to UI immediately (optimistic update)
    // Full context will be populated when we refresh from server
    const userMessage: ConversationMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId!,
      user_id: null, // Will be set by backend
      type: "Prompt",
      prompt: prompt,
      projects: null, // Will be enriched by backend in full response
      tasks: null, // Will be enriched by backend in full response
      todos: null,
      text: null,
      blocks: null,
      token_usage: null,
      metadata: null,
      embedding_id: null,
      created_at: new Date().toISOString(),
    };
    addMessage(userMessage);

    // Clear input
    setInputValue("");
    setIsSending(true);

    // Prepare context data - only send IDs
    const projectIds = selectedProjects.map((p) => ({ project_id: p.id }));
    const taskIds = selectedTasks.map((t) => ({ task_id: t.id }));

    try {
      const response = await chat({
        conversation_id: conversationId!,
        prompt,
        projects: projectIds.length > 0 ? projectIds : undefined,
        tasks: taskIds.length > 0 ? taskIds : undefined,
      });

      if (response?.success && response.data) {
        // Add AI response to messages
        const aiMessage: ConversationMessage = {
          id: `msg-${Date.now()}`,
          conversation_id: conversationId!,
          user_id: null,
          type: "Response",
          prompt: null,
          projects: null,
          tasks: null,
          todos: null,
          text: response.data.text,
          blocks: response.data.blocks || null,
          token_usage: response.data.token_usage || null,
          metadata: null,
          embedding_id: null,
          created_at: response.data.timestamp || new Date().toISOString(),
        };
        addMessage(aiMessage);

        // Refresh messages to get the full updated list from server
        await refreshMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
    }
  }, [inputValue]);

  return (
    <div
      className={`fixed bottom-0 right-0 transition-all duration-300 ${
        isSidenavCollapsed ? "left-0 md:left-16" : "left-0 md:left-64"
      } ${
        isRightSidenavCollapsed ? "right-0 md:right-16" : "right-0 md:right-64"
      }`}
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
                            setInputValue(action.label);
                            setIsContextDrawerOpen(false);
                          }}
                          className="flex items-center gap-3 p-4 bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700/40 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] group"
                        >
                          <div
                            className={`p-2 rounded-lg bg-gray-900/50 ${action.color}`}
                          >
                            <action.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          </div>
                          <span className="text-sm text-gray-200 font-roboto">
                            {action.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Projects Tab */}
                  {activeTab === "projects" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {isLoadingProjects ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-gray-400 font-roboto">
                            Loading projects...
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Project Selection */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-poppins font-semibold text-gray-400 uppercase tracking-wide mb-3">
                              Select Projects
                            </h4>
                            {projects.length === 0 ? (
                              <div className="text-center py-8 text-gray-500 font-roboto text-sm">
                                No projects found. Create a project to get
                                started.
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-2">
                                {projects.map((project) => {
                                  const isSelected = selectedProjects.some(
                                    (p) => p.id === project.id
                                  );
                                  const colorClass = getColorClass(
                                    project.color_hex
                                  );
                                  const colorStyle = getColorStyle(
                                    project.color_hex
                                  );
                                  return (
                                    <button
                                      key={project.id}
                                      onClick={() => toggleProject(project)}
                                      style={colorStyle}
                                      className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:scale-[1.01] shadow-lg ${
                                        isSelected
                                          ? `${colorClass} text-white border-2 border-white/30`
                                          : `${colorClass} text-white opacity-70 hover:opacity-100 border-2 border-transparent`
                                      }`}
                                    >
                                      <div className="flex items-center justify-center w-5 h-5 rounded border-2 border-white/50 bg-white/10">
                                        {isSelected && (
                                          <Check className="h-3.5 w-3.5" />
                                        )}
                                      </div>
                                      <FolderKanban className="h-4 w-4" />
                                      <div className="flex-1">
                                        <div className="font-poppins font-semibold text-sm">
                                          {project.title}
                                        </div>
                                        {project.course_code && (
                                          <div className="text-xs opacity-90">
                                            {project.course_code}
                                          </div>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Task Selection */}
                          {selectedProjects.length > 0 && (
                            <div className="space-y-2 pt-4 border-t border-gray-700/50">
                              <h4 className="text-sm font-poppins font-semibold text-gray-400 uppercase tracking-wide mb-3">
                                Select Tasks
                              </h4>
                              {selectedProjects.map((project) => {
                                const projectTasks = tasks.filter(
                                  (t) => t.project_id === project.id
                                );
                                if (projectTasks.length === 0) return null;
                                return (
                                  <div key={project.id} className="space-y-2">
                                    <p className="text-xs text-gray-500 font-roboto">
                                      {project.title}
                                    </p>
                                    {projectTasks.map((task) => {
                                      const isSelected = selectedTasks.some(
                                        (t) => t.id === task.id
                                      );
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
                                            {isSelected && (
                                              <Check className="h-3 w-3" />
                                            )}
                                          </div>
                                          <FileText className="h-3.5 w-3.5" />
                                          <span className="text-xs font-roboto flex-1">
                                            {task.title}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </>
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
            {(selectedProjects.length > 0 || selectedTasks.length > 0) && (
              <div className="flex flex-wrap gap-2 justify-center animate-in fade-in slide-in-from-top-2 duration-300 max-w-3xl">
                {selectedProjects.map((project) => {
                  const colorClass = getColorClass(project.color_hex);
                  const colorStyle = getColorStyle(project.color_hex);
                  return (
                    <div
                      key={project.id}
                      style={colorStyle}
                      className={`flex items-center gap-2 px-3 py-1.5 ${colorClass} text-white rounded-full text-sm font-medium shadow-lg animate-in fade-in zoom-in-95 duration-300`}
                    >
                      <FolderKanban className="h-3.5 w-3.5" />
                      <span className="max-w-[150px] truncate">
                        {project.title}
                      </span>
                      <button
                        onClick={() => removeProject(project.id)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}

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
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isSending || aiLoading}
                    />
                    <style jsx>{`
                      textarea::-webkit-scrollbar {
                        width: 4px;
                      }
                      textarea::-webkit-scrollbar-track {
                        background: transparent;
                      }
                      textarea::-webkit-scrollbar-thumb {
                        background: #4b5563;
                        border-radius: 2px;
                      }
                      textarea::-webkit-scrollbar-thumb:hover {
                        background: #6b7280;
                      }
                    `}</style>
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending || aiLoading || !inputValue.trim()}
                    className="flex-shrink-0 relative group/send self-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
  );
}
