import { ResourceCard } from "./resource-card"
import { TimetableBlock } from "./timetable-block"
import { AssignmentExplanation } from "./assignment-explanation"
import { TimetablePreview } from "./timetable-preview"
import { FocusModeBlock } from "./focus-mode-block"
import { ProgressBlock } from "./progress-block"
import { UserMessage } from "./user-message"
import { AiThinkingLoader } from "./ai-thinking-loader"

export function ChatArea() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-12">
      <UserMessage message="Can you help me organize my study schedule?" />

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-noki-primary to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
            N
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-gray-100 font-roboto leading-relaxed">
              I've found some great resources to help you with your studies!
            </p>
            <ResourceCard />
          </div>
        </div>
      </div>

      <UserMessage message="Show me my timetable for this week" />

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-noki-primary to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
            N
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-gray-100 font-roboto leading-relaxed">
              Here's your timetable for this week. I've organized all your classes and study sessions.
            </p>
            <TimetableBlock />
          </div>
        </div>
      </div>

      <UserMessage message="Can you explain this assignment to me?" />

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-noki-primary to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
            N
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-gray-100 font-roboto leading-relaxed">
              Let me break down this assignment for you step by step.
            </p>
            <AssignmentExplanation />
          </div>
        </div>
      </div>

      <UserMessage message="What assignments do I have coming up?" />

      <AiThinkingLoader />

      <UserMessage message="Create a new timetable for next semester" />

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-noki-primary to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
            N
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-gray-100 font-roboto leading-relaxed">
              I've created a balanced timetable for your next semester. Here's a preview of your schedule.
            </p>
            <TimetablePreview />
          </div>
        </div>
      </div>

      <UserMessage message="Help me focus on my studies" />

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-noki-primary to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
            N
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-gray-100 font-roboto leading-relaxed">
              I've activated focus mode to help you concentrate on your most important tasks.
            </p>
            <FocusModeBlock />
          </div>
        </div>
      </div>

      <UserMessage message="Show me my progress this month" />

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-noki-primary to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
            N
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-gray-100 font-roboto leading-relaxed">
              Great work! Here's a summary of your progress this month. You're doing amazing!
            </p>
            <ProgressBlock />
          </div>
        </div>
      </div>
    </div>
  )
}
