"use client"

import type React from "react"

import { createContext, useContext } from "react"

interface SidenavContextType {
  isSidenavCollapsed: boolean
  isRightSidenavCollapsed: boolean
}

const SidenavContext = createContext<SidenavContextType | undefined>(undefined)

export function SidenavProvider({
  children,
  isSidenavCollapsed,
  isRightSidenavCollapsed,
}: {
  children: React.ReactNode
  isSidenavCollapsed: boolean
  isRightSidenavCollapsed: boolean
}) {
  return (
    <SidenavContext.Provider value={{ isSidenavCollapsed, isRightSidenavCollapsed }}>
      {children}
    </SidenavContext.Provider>
  )
}

export function useSidenav() {
  const context = useContext(SidenavContext)
  if (context === undefined) {
    throw new Error("useSidenav must be used within a SidenavProvider")
  }
  return context
}
