interface UserMessageProps {
  message: string
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[70%] bg-gray-700 text-white px-5 py-3 rounded-3xl rounded-tr-md shadow-lg">
        <p className="text-sm font-roboto leading-relaxed">{message}</p>
      </div>
    </div>
  )
}
