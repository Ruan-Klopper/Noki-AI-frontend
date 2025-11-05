"use client";

import type React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import NokiSidenav from "./noki-sidenav";
import TodosSidenav from "./todos-sidenav";
import ContentArea from "./content-area";
import { SidenavProvider } from "./sidenav-context";
import { AuthProvider } from "@/services/auth/auth-context";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const getPageTitle = (pathname: string): string => {
  if (pathname === "/") return "Home";
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname === "/timetable") return "Timetable";
  if (pathname === "/resources") return "Resources";
  if (pathname === "/settings") return "Settings";

  // Extract page name from path
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    return segments[segments.length - 1]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return "Page";
};

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [isSidenavCollapsed, setIsSidenavCollapsed] = useState(false);
  const [isRightSidenavCollapsed, setIsRightSidenavCollapsed] = useState(false);

  const isAuthRoute =
    pathname?.startsWith("/auth") ||
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/";

  if (isAuthRoute) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  const pageTitle = getPageTitle(pathname || "");

  const handleToggleSidenav = () => {
    setIsSidenavCollapsed(!isSidenavCollapsed);
  };

  const handleToggleRightSidenav = () => {
    setIsRightSidenavCollapsed(!isRightSidenavCollapsed);
  };

  const isWideLayout = pathname === "/timetable";

  return (
    <AuthProvider>
      <div className="flex flex-col md:flex-row h-screen bg-background">
        <SidenavProvider
          isSidenavCollapsed={isSidenavCollapsed}
          isRightSidenavCollapsed={isRightSidenavCollapsed}
        >
          <NokiSidenav
            isCollapsed={isSidenavCollapsed}
            onToggle={handleToggleSidenav}
          />
          <ContentArea
            pageTitle={pageTitle}
            onToggleSidenav={handleToggleSidenav}
            isSidenavCollapsed={isSidenavCollapsed}
            isRightSidenavCollapsed={isRightSidenavCollapsed}
            isWideLayout={isWideLayout}
          >
            {children}
          </ContentArea>
          <TodosSidenav
            isCollapsed={isRightSidenavCollapsed}
            onToggle={handleToggleRightSidenav}
          />
        </SidenavProvider>
      </div>
    </AuthProvider>
  );
}
