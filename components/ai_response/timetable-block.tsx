import { NokiButton } from "@/components/global/noki-button"
import { Calendar, Clock } from "lucide-react"

export function TimetableBlock() {
  return (
    <div className="noki-card">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-noki-primary" />
          <h3 className="font-heading font-bold text-foreground">Suggested Schedule Updates</h3>
        </div>

        {/* Task Group 1 */}
        <div className="space-y-3">
          <h4 className="font-heading font-semibold text-foreground flex items-center space-x-2">
            <Clock className="h-4 w-4 text-noki-primary" />
            <span>Morning Block (9:00 - 12:00)</span>
          </h4>
          <div className="space-y-2 ml-6">
            <div className="flex items-center justify-between p-2 bg-background rounded-lg border border-border">
              <span className="text-sm">Task 1: Review Math Assignment</span>
              <span className="text-xs text-muted-foreground">30 min</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-background rounded-lg border border-border">
              <span className="text-sm">Task 2: Complete Physics Lab Report</span>
              <span className="text-xs text-muted-foreground">90 min</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-background rounded-lg border border-border">
              <span className="text-sm">Task 3: Study for History Quiz</span>
              <span className="text-xs text-muted-foreground">60 min</span>
            </div>
          </div>
        </div>

        {/* Task Group 2 */}
        <div className="space-y-3">
          <h4 className="font-heading font-semibold text-foreground flex items-center space-x-2">
            <Clock className="h-4 w-4 text-noki-primary" />
            <span>Afternoon Block (2:00 - 5:00)</span>
          </h4>
          <div className="space-y-2 ml-6">
            <div className="flex items-center justify-between p-2 bg-background rounded-lg border border-border">
              <span className="text-sm">Task 1: Work on English Essay</span>
              <span className="text-xs text-muted-foreground">120 min</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-background rounded-lg border border-border">
              <span className="text-sm">Task 2: Chemistry Problem Set</span>
              <span className="text-xs text-muted-foreground">45 min</span>
            </div>
          </div>
        </div>

        {/* Accept/Decline Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-border">
          <NokiButton variant="positive" size="sm">
            Accept Schedule
          </NokiButton>
          <NokiButton variant="negative" size="sm">
            Decline
          </NokiButton>
        </div>
      </div>
    </div>
  )
}
