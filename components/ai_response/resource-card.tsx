import { FileText, ExternalLink } from "lucide-react"

export function ResourceCard() {
  return (
    <div className="noki-card max-w-md">
      <div className="flex items-start space-x-3">
        <div className="bg-noki-primary p-2 rounded-lg">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-bold text-foreground mb-1">Resource Found</h3>
          <p className="text-sm text-muted-foreground mb-3">I found a relevant resource for your query:</p>
          <div className="flex items-center justify-between bg-background p-3 rounded-lg border border-border">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-noki-primary" />
              <span className="text-sm font-medium">Intro to AI PDF</span>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  )
}
