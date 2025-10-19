import { NokiButton } from "@/components/global/noki-button"
import { Send, Paperclip } from "lucide-react"

export function ChatBar() {
  return (
    <div className="bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-lg p-3 fixed bottom-4 left-4 right-4">
      <div className="flex items-end space-x-3">
        {/* Input Area */}
        <div className="flex-1 flex items-center bg-gray-900 border border-gray-700 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-noki-primary">
          <textarea
            placeholder="Ask Noki anything..."
            className="flex-1 bg-transparent resize-none focus:outline-none text-gray-100 placeholder-gray-500 font-roboto p-2"
            rows={1}
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
          <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>
        </div>

        {/* Send Button */}
        <NokiButton variant="positive" size="md" className="rounded-full p-3">
          <Send className="h-5 w-5" />
        </NokiButton>
      </div>
    </div>
  )
}
