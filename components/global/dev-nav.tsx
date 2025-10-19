"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Code2 } from "lucide-react"
import Link from "next/link"

export default function DevNav() {
  const [isExpanded, setIsExpanded] = useState(false)

  const pages = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Timetable", path: "/timetable" },
    { name: "Chat with Noki", path: "/chat" },
  ]

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[10000]">
      {/* Expanded Content */}
      <div
        className={`bg-white border border-gray-200 rounded-b-xl shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 min-w-[400px]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
            <Code2 className="w-5 h-5 text-noki-primary" />
            <h3 className="font-poppins font-semibold text-gray-800">Quick Navigation</h3>
          </div>

          <div className="space-y-2">
            {pages.map((page) => (
              <Link
                key={page.path}
                href={page.path}
                className="block px-4 py-2.5 text-sm font-roboto text-gray-700 hover:bg-noki-primary hover:text-white rounded-lg transition-colors"
                onClick={() => setIsExpanded(false)}
              >
                {page.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Handle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gradient-to-r from-noki-primary to-noki-tertiary text-white px-6 py-2 rounded-b-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-roboto text-sm font-medium"
      >
        <Code2 className="w-4 h-4" />
        <span>Dev Nav</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </div>
  )
}
