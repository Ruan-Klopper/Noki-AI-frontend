"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Settings,
  MessageCircle,
  LogOut,
  Menu,
  X,
  GraduationCap,
  FolderKanban,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuthContext } from "../../services/auth/auth-context";

interface SidenavProps {
  className?: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

const mockConversations = [
  { id: "1", title: "Help with React Hooks", timestamp: "2 hours ago" },
  { id: "2", title: "Explain TypeScript Generics", timestamp: "Yesterday" },
  { id: "3", title: "CSS Grid Layout Tips", timestamp: "2 days ago" },
  { id: "4", title: "Next.js App Router Guide", timestamp: "3 days ago" },
  { id: "5", title: "Database Design Questions", timestamp: "1 week ago" },
];

export default function NokiSidenav({
  className = "",
  isCollapsed,
  onToggle,
}: SidenavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavAccordionOpen, setIsNavAccordionOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >("1");
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthContext();

  const navLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/projects", icon: FolderKanban, label: "Projects" },
    { href: "/timetable", icon: Calendar, label: "Timetable" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  const isActiveLink = (href: string) => pathname === href;

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still redirect to signin even if logout fails
      router.push("/signin");
    }
  };

  const isChatActive = pathname === "/chat";

  return (
    <>
      <div
        className={`hidden md:flex bg-card border-r border-border flex-col h-screen transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } ${className}`}
      >
        <div className="p-4 border-b border-border flex items-center justify-start px-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-noki-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-poppins font-bold text-lg">
                N
              </span>
            </div>
            {!isCollapsed && (
              <span className="font-poppins font-bold text-xl text-noki-primary">
                Noki
              </span>
            )}
          </div>
        </div>

        {/* Navigation Links - Scrollable */}
        <div className="flex-1 overflow-y-auto py-4">
          {isChatActive && !isCollapsed ? (
            <div className="px-3 mb-4">
              <button
                onClick={() => setIsNavAccordionOpen(!isNavAccordionOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all font-roboto text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <span className="text-sm font-medium">Navigation</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isNavAccordionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isNavAccordionOpen
                    ? "max-h-96 opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <nav className="space-y-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = isActiveLink(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-roboto ${
                          isActive
                            ? "bg-noki-primary text-white"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          ) : (
            <nav className="space-y-2 px-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActiveLink(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-roboto ${
                      isActive
                        ? "bg-noki-primary text-white"
                        : "text-foreground hover:bg-secondary"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>{link.label}</span>}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="mx-3 my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="px-3">
            <Link
              href="/chat"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-roboto ${
                isChatActive
                  ? "bg-noki-primary text-white"
                  : "bg-card/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <MessageCircle className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">Chat with Noki</span>
              )}
            </Link>
          </div>

          {isChatActive && !isCollapsed && (
            <div className="px-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-xs font-roboto font-semibold text-muted-foreground uppercase tracking-wider">
                  Conversations
                </p>
                <button className="p-1 hover:bg-secondary rounded-md transition-colors group">
                  <Plus className="w-4 h-4 text-muted-foreground group-hover:text-noki-primary transition-colors" />
                </button>
              </div>
              <div className="space-y-1">
                {mockConversations.map((conversation, index) => {
                  const isActiveConversation =
                    activeConversationId === conversation.id;

                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setActiveConversationId(conversation.id)}
                      className={`group flex items-start gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer animate-in fade-in slide-in-from-left-2 duration-300 ${
                        isActiveConversation
                          ? "bg-noki-primary/10 border border-noki-primary/20"
                          : "hover:bg-secondary"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <MessageCircle
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          isActiveConversation
                            ? "text-noki-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-roboto truncate ${
                            isActiveConversation
                              ? "text-noki-primary font-medium"
                              : "text-foreground"
                          }`}
                        >
                          {conversation.title}
                        </p>
                        <p className="text-xs font-roboto text-muted-foreground">
                          {conversation.timestamp}
                        </p>
                      </div>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mx-3 my-4 border-t border-border" />
        </div>

        {/* Footer */}
        <div className="border-t border-border p-3 space-y-3">
          {!isCollapsed && (
            <p className="px-3 text-xs font-roboto font-semibold text-muted-foreground uppercase tracking-wider">
              Integrations
            </p>
          )}

          <Link
            href="/integrations/canvas"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-roboto bg-red-500 text-white hover:bg-red-600 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <GraduationCap className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Canvas LMS</span>}
          </Link>

          <div className="border-t border-border" />

          <div className="rounded-lg p-2 space-y-1 bg-secondary">
            <div
              className={`flex items-center gap-3 px-2 py-2 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <div className="w-8 h-8 bg-noki-tertiary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-poppins font-bold text-sm">
                  {user ? user.firstname.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="font-roboto text-lg font-semibold text-foreground truncate">
                    {user ? `${user.firstname} ${user.lastname}` : "Loading..."}
                  </div>
                  <div className="font-roboto text-xs text-muted-foreground truncate">
                    {user ? user.email : "..."}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-md transition-colors font-roboto text-foreground hover:bg-muted ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-noki-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-poppins font-bold text-lg">N</span>
          </div>
          <span className="font-poppins font-bold text-xl text-noki-primary">
            Noki
          </span>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-secondary rounded-md transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-noki-primary" />
          ) : (
            <Menu className="w-6 h-6 text-noki-primary" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="bg-card w-80 h-full shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-noki-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-poppins font-bold text-lg">
                    N
                  </span>
                </div>
                <span className="font-poppins font-bold text-xl text-noki-primary">
                  Noki
                </span>
              </div>
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 hover:bg-secondary rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-noki-primary" />
              </button>
            </div>

            <div className="py-4">
              {isChatActive ? (
                <div className="px-3 mb-4">
                  <button
                    onClick={() => setIsNavAccordionOpen(!isNavAccordionOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all font-roboto text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <span className="text-sm font-medium">Navigation</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isNavAccordionOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isNavAccordionOpen
                        ? "max-h-96 opacity-100 mt-2"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <nav className="space-y-2">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = isActiveLink(link.href);

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={handleMobileLinkClick}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-roboto ${
                              isActive
                                ? "bg-noki-primary text-white"
                                : "text-foreground hover:bg-secondary"
                            }`}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              ) : (
                <nav className="space-y-2 px-3">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = isActiveLink(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={handleMobileLinkClick}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-roboto ${
                          isActive
                            ? "bg-noki-primary text-white"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              )}

              <div className="mx-3 my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <div className="px-3">
                <Link
                  href="/chat"
                  onClick={handleMobileLinkClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-roboto ${
                    isChatActive
                      ? "bg-noki-primary text-white"
                      : "bg-card/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <MessageCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">Chat with Noki</span>
                </Link>
              </div>

              {isChatActive && (
                <div className="px-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-xs font-roboto font-semibold text-muted-foreground uppercase tracking-wider">
                      Conversations
                    </p>
                    <button className="p-1 hover:bg-secondary rounded-md transition-colors group">
                      <Plus className="w-4 h-4 text-muted-foreground group-hover:text-noki-primary transition-colors" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {mockConversations.map((conversation, index) => {
                      const isActiveConversation =
                        activeConversationId === conversation.id;

                      return (
                        <div
                          key={conversation.id}
                          onClick={() => {
                            setActiveConversationId(conversation.id);
                            handleMobileLinkClick();
                          }}
                          className={`group flex items-start gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer animate-in fade-in slide-in-from-left-2 duration-300 ${
                            isActiveConversation
                              ? "bg-noki-primary/10 border border-noki-primary/20"
                              : "hover:bg-secondary"
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <MessageCircle
                            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                              isActiveConversation
                                ? "text-noki-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-roboto truncate ${
                                isActiveConversation
                                  ? "text-noki-primary font-medium"
                                  : "text-foreground"
                              }`}
                            >
                              {conversation.title}
                            </p>
                            <p className="text-xs font-roboto text-muted-foreground">
                              {conversation.timestamp}
                            </p>
                          </div>
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete
                            }}
                          >
                            <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Horizontal divider */}
              <div className="mx-3 my-4 border-t border-border" />

              {/* Footer */}
              <div className="border-t border-border p-3 space-y-3">
                <p className="px-3 text-xs font-roboto font-semibold text-muted-foreground uppercase tracking-wider">
                  Integ
                </p>

                <Link
                  href="/integrations/canvas"
                  onClick={handleMobileLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-roboto bg-red-500 text-white hover:bg-red-600"
                >
                  <GraduationCap className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">Canvas LMS test</span>
                </Link>

                <div className="border-t border-border" />

                <div className="rounded-lg p-2 space-y-1 bg-secondary">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 bg-noki-tertiary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-poppins font-bold text-sm">
                        {user ? user.firstname.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="font-roboto text-lg font-semibold text-foreground truncate">
                        {user
                          ? `${user.firstname} ${user.lastname}`
                          : "Loading..."}
                      </div>
                      <div className="font-roboto text-xs text-muted-foreground truncate">
                        {user ? user.email : "..."}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-md transition-colors font-roboto text-foreground hover:bg-muted"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
