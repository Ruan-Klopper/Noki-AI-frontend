"use client";

import { useConversationContext } from "@/services/ai/conversation-context";
import { UserMessage } from "./user-message";
import { AiThinkingLoader } from "./ai-thinking-loader";
import { MarkdownText } from "./markdown-text";
import { AssignmentExplanation } from "./assignment-explanation";

export function ChatArea() {
  const { messages, isLoading, activeConversationId } =
    useConversationContext();

  // Show empty state if no conversation is selected
  if (!activeConversationId) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p className="text-lg font-roboto">
            Select a conversation to start chatting
          </p>
          <p className="text-sm mt-2">Or create a new conversation to begin</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (messages.length === 0 && isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <AiThinkingLoader />
      </div>
    );
  }

  // Show empty conversation
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p className="text-lg font-roboto">No messages yet</p>
          <p className="text-sm mt-2">
            Start the conversation by sending a message
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-12">
      {messages.map((message) => {
        if (message.type === "Prompt") {
          // User message
          return (
            <UserMessage key={message.id} message={message.prompt || ""} />
          );
        } else {
          // AI message (type === "Response")
          return (
            <div key={message.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-noki-primary flex items-center justify-center text-white text-sm font-bold shadow-md">
                  N
                </div>
                <div className="flex-1 space-y-4">
                  {/* Display text with markdown parsing */}
                  {message.text && (
                    <div className="text-gray-100 font-roboto leading-relaxed pb-4">
                      <MarkdownText text={message.text} />
                    </div>
                  )}

                  {/* Display blocks - handle explanation_block specially */}
                  {message.blocks && message.blocks.length > 0 && (
                    <div className="space-y-3">
                      {message.blocks.map((block: any, index) => {
                        // Check if this is an explanation_block
                        if (block.type === "explanation_block") {
                          return (
                            <AssignmentExplanation
                              key={index}
                              title={block.title}
                              description={block.description}
                              footer={block.footer}
                            />
                          );
                        }

                        // For other block types, show JSON for now
                        return (
                          <div
                            key={index}
                            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                          >
                            <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                              {JSON.stringify(block, null, 2)}
                            </pre>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Display timestamp if available */}
                  {message.created_at && (
                    <p className="text-xs text-gray-500 font-roboto mt-2">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  )}

                  {/* Display token usage if available */}
                  {message.token_usage && (
                    <div className="mt-2 text-xs text-gray-500 font-roboto">
                      <p>
                        Tokens: {message.token_usage.total_tokens} | Cost: $
                        {message.token_usage.cost_estimate_usd.toFixed(4)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
      })}
      {isLoading && <AiThinkingLoader />}
    </div>
  );
}
