"use client"

import type React from "react"
import { Menu, X } from "lucide-react"

interface ContentAreaProps {
  children: React.ReactNode
  pageTitle: string
  onToggleSidenav: () => void
  isSidenavCollapsed: boolean
  isRightSidenavCollapsed: boolean
  isWideLayout?: boolean
}

export default function ContentArea({
  children,
  pageTitle,
  onToggleSidenav,
  isSidenavCollapsed,
  isRightSidenavCollapsed,
  isWideLayout = false,
}: ContentAreaProps) {
  return (
    <div
      className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${!isRightSidenavCollapsed ? "md:mr-80" : "md:mr-16"}`}
    >
      <nav className="bg-card border-b border-border px-5 py-4 flex items-center gap-4 min-h-[64px] md:px-3.5">
        <button
          onClick={onToggleSidenav}
          className="p-2 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center bg-primary"
          aria-label="Toggle navigation"
        >
          {isSidenavCollapsed ? (
            <Menu className="w-5 h-5 text-white md:hidden" />
          ) : (
            <X className="w-5 h-5 text-white md:hidden" />
          )}
          <div className="hidden md:block">
            <Menu className="w-5 h-5 text-white" />
          </div>
        </button>

        <h1 className="font-poppins font-semibold text-xl text-noki-primary">{pageTitle}</h1>
      </nav>

      <main className="flex-1 overflow-auto bg-background">
        <div className="px-5 py-5 md:px-10 md:py-10">
          <div className={`mx-auto ${isWideLayout ? "max-w-[1150px]" : "max-w-[900px]"}`}>{children}</div>
        </div>
      </main>
    </div>
  )
}
