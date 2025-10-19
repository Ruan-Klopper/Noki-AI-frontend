"use client"

interface BottomNavBarProps {
  onPrevious?: () => void
  onNext?: () => void
  onAgree?: () => void
  onDecline?: () => void
  showPrevious?: boolean
  showNext?: boolean
  showAgree?: boolean
  showDecline?: boolean
  nextLabel?: string
  isLoading?: boolean
}

export function BottomNavBar({
  onPrevious,
  onNext,
  onAgree,
  onDecline,
  showPrevious = false,
  showNext = false,
  showAgree = false,
  showDecline = false,
  nextLabel = "Next",
  isLoading = false,
}: BottomNavBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          {showPrevious && (
            <button
              onClick={onPrevious}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg font-roboto text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
          )}
          {showDecline && (
            <button
              onClick={onDecline}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg font-roboto text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Decline
            </button>
          )}
        </div>

        <div>
          {showNext && (
            <button
              onClick={onNext}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg font-roboto bg-noki-primary text-noki-secondary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Loading..." : nextLabel}
            </button>
          )}
          {showAgree && (
            <button
              onClick={onAgree}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg font-roboto bg-noki-primary text-noki-secondary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Agree"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
