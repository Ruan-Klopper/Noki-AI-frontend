"use client"

import type React from "react"
import PrismaticBurst from "./prismatic-burst"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="absolute inset-0">
        <PrismaticBurst
          intensity={0.7}
          speed={0.3}
          animationType="rotate3d"
          colors={[
            "#60a5fa", // Bright blue
            "#f472b6", // Bright pink
            "#fb923c", // Bright orange
            "#fbbf24", // Bright yellow
            "#34d399", // Bright green
            "#a78bfa", // Bright purple
          ]}
          distort={2}
          rayCount={8}
          mixBlendMode="normal"
        />
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">{children}</div>
    </div>
  )
}
