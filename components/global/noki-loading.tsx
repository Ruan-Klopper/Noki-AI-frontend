import { cn } from "@/lib/utils"

interface NokiLoadingProps {
  label?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function NokiLoading({ label = "Loading", className, size = "md" }: NokiLoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-noki-primary", sizeClasses[size])}
      />
      <p className={cn("text-muted-foreground font-medium", textSizeClasses[size])}>{label}</p>
    </div>
  )
}
