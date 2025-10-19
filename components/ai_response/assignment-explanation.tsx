import { BookOpen, Lightbulb } from "lucide-react"

export function AssignmentExplanation() {
  return (
    <div className="noki-card">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-noki-primary" />
          <h3 className="font-heading font-bold text-foreground">Assignment Explanation</h3>
        </div>

        <div className="space-y-3">
          <p className="text-foreground">
            This assignment is about exploring the fundamental concepts of artificial intelligence and machine learning.
            You'll need to understand the basic principles, applications, and ethical considerations surrounding AI
            technology.
          </p>

          <div className="bg-background p-4 rounded-lg border border-border">
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-4 w-4 text-noki-tertiary mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-2">Key Points to Cover:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Define artificial intelligence and its main branches</li>
                  <li>• Explain supervised vs unsupervised learning</li>
                  <li>• Discuss real-world applications of AI</li>
                  <li>• Address ethical implications and bias in AI systems</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <strong>Due Date:</strong> Friday, March 15th at 11:59 PM
          </div>
        </div>
      </div>
    </div>
  )
}
