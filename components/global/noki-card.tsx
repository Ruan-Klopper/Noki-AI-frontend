import type React from "react"
import { cn } from "@/lib/utils"
import { type HTMLAttributes, forwardRef } from "react"

interface NokiCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const NokiCard = forwardRef<HTMLDivElement, NokiCardProps>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-card shadow-lg p-4 transition-shadow duration-200 hover:shadow-xl rounded-2xl px-4 py-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})

NokiCard.displayName = "NokiCard"

export { NokiCard }
