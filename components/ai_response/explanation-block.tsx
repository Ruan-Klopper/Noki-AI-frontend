"use client";

import { BookOpen } from "lucide-react";
import { MarkdownText } from "./markdown-text";

interface ExplanationBlockProps {
  explanation_content: string;
}

export function ExplanationBlock({
  explanation_content,
}: ExplanationBlockProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden mt-4">
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-noki-primary" />
          <div className="font-poppins font-bold text-gray-100 text-lg">
            Explanation
          </div>
        </div>

        <div className="text-gray-200 font-roboto leading-relaxed">
          <MarkdownText text={explanation_content} />
        </div>
      </div>
    </div>
  );
}
