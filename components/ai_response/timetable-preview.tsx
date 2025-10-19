import { NokiButton } from "@/components/global/noki-button"
import { Calendar, Save } from "lucide-react"

export function TimetablePreview() {
  return (
    <div className="noki-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-noki-primary" />
            <h3 className="font-heading font-bold text-foreground">Weekly Schedule Preview</h3>
          </div>
          <span className="text-sm text-muted-foreground">March 11-17, 2024</span>
        </div>

        {/* Mock Calendar Grid */}
        <div className="bg-background rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-8 gap-0">
            {/* Header Row */}
            <div className="p-2 bg-muted text-center text-xs font-medium text-muted-foreground">Time</div>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="p-2 bg-muted text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}

            {/* Time Slots */}
            {["9:00", "10:00", "11:00", "12:00", "1:00", "2:00"].map((time) => (
              <div key={time} className="contents">
                <div className="p-2 text-xs text-muted-foreground border-t border-border">{time}</div>
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="p-1 border-t border-border min-h-[40px] relative">
                    {/* Sample events */}
                    {time === "9:00" && i === 0 && (
                      <div className="bg-noki-primary text-white text-xs p-1 rounded text-center">Math</div>
                    )}
                    {time === "10:00" && i === 1 && (
                      <div className="bg-noki-tertiary text-white text-xs p-1 rounded text-center">Physics</div>
                    )}
                    {time === "11:00" && i === 2 && (
                      <div className="bg-green-500 text-white text-xs p-1 rounded text-center">History</div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <NokiButton variant="positive" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Schedule
          </NokiButton>
        </div>
      </div>
    </div>
  )
}
