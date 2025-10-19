import { TrendingUp, Target } from "lucide-react"

export function ProgressBlock() {
  return (
    <div className="noki-card max-w-md">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-noki-primary" />
          <h3 className="font-heading font-bold text-foreground">Weekly Progress</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Assignments Completed</span>
            <span className="text-sm font-medium text-noki-primary">7/10</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-noki-primary h-3 rounded-full transition-all duration-300"
              style={{ width: "70%" }}
            ></div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>You've completed 70% of this week's goals!</span>
          </div>

          <div className="bg-background p-3 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground">
              Great progress! You're on track to meet your weekly targets. Keep it up!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
