import { NokiButton } from "@/components/global/noki-button"
import { Timer, Play } from "lucide-react"

export function FocusModeBlock() {
  return (
    <div className="noki-card max-w-md">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Timer className="h-5 w-5 text-noki-primary" />
          <h3 className="font-heading font-bold text-foreground">Focus Mode</h3>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-background p-6 rounded-lg border border-border">
            <div className="text-3xl font-heading font-bold text-noki-primary mb-2">25:00</div>
            <p className="text-sm text-muted-foreground">Pomodoro Session</p>
          </div>

          <p className="text-sm text-foreground">
            Ready to start a focused study session? I'll help you stay on track with a 25-minute timer.
          </p>

          <NokiButton variant="positive" size="md" className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Start 25 min Study Session
          </NokiButton>
        </div>
      </div>
    </div>
  )
}
