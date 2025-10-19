import Link from "next/link"

export function NokiHeader() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-heading font-bold text-noki-primary">Noki</h1>
        </div>

        <nav className="flex items-center space-x-4">
          <Link
            href="/signin"
            className="px-4 py-2 rounded-lg font-roboto text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg font-roboto bg-noki-primary text-noki-secondary hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  )
}
