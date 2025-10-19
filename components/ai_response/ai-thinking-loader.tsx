export function AiThinkingLoader() {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-noki-primary to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
          N
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div
                className="w-2 h-2 bg-noki-primary rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-noki-primary rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-noki-primary rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <p className="text-gray-300 font-roboto text-sm animate-pulse">
              Looking at your assignments and courses...
            </p>
          </div>

          <div className="noki-card p-4 border-l-4 border-noki-primary/50">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-noki-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing your Canvas courses</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div
                  className="w-4 h-4 border-2 border-noki-primary border-t-transparent rounded-full animate-spin"
                  style={{ animationDelay: "200ms" }}
                ></div>
                <span>Reviewing upcoming assignments</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div
                  className="w-4 h-4 border-2 border-noki-primary border-t-transparent rounded-full animate-spin"
                  style={{ animationDelay: "400ms" }}
                ></div>
                <span>Checking your personal projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
