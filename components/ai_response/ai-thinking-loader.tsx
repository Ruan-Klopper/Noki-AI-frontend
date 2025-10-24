export function AiThinkingLoader() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-noki-primary flex items-center justify-center text-white text-sm font-bold shadow-md">
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
            <div className="text-gray-300 font-roboto text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
