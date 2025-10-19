import { ChatArea } from "@/components/ai_response/chat-area"
import { ChatInterface } from "@/components/ai_response/chat-interface"

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto pb-48">
        <ChatArea />
      </div>

      <ChatInterface />
    </div>
  )
}
