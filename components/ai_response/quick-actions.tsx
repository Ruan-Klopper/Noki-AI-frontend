import { NokiButton } from "@/components/global/noki-button"
import { Calendar, FileText, HelpCircle, Clock } from "lucide-react"

export function QuickActions() {
  return (
    <div className="p-4 border-b border-border">
      <div className="max-w-4xl mx-auto">
        <h4 className="font-heading font-semibold text-foreground mb-3 text-sm">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <NokiButton variant="positive" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            How does my schedule look?
          </NokiButton>
          <NokiButton variant="positive" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Create a new timetable
          </NokiButton>
          <NokiButton variant="positive" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Explain assignment
          </NokiButton>
          <NokiButton variant="positive" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Study tips
          </NokiButton>
        </div>
      </div>
    </div>
  )
}
