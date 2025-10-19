import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

interface NokiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "positive" | "negative" | "gradient"
  size?: "sm" | "md" | "lg"
}

const NokiButton = forwardRef<HTMLButtonElement, NokiButtonProps>(
  ({ className, variant = "positive", size = "md", children, disabled, ...props }, ref) => {
    const baseClasses =
      "font-heading font-bold transition-all duration-200 rounded-[18px] shadow-md hover:shadow-none active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"

    const variantClasses = {
      positive: "bg-noki-primary hover:bg-[#155a85] text-noki-secondary", // Primary actions: Next, Confirm, Submit
      negative: "bg-noki-tertiary hover:bg-[#e55a24] text-noki-secondary", // Secondary actions: Back, Cancel, Warning
      gradient: "bg-gradient-noki hover:opacity-90 text-noki-secondary",
    }

    const sizeClasses = {
      sm: "px-5 py-3 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    return (
      <Button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
    )
  },
)

NokiButton.displayName = "NokiButton"

export { NokiButton }
