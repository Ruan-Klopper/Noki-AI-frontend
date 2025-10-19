"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [loadingText, setLoadingText] = useState("Authenticating")

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLoadingText("Loading your data")
    }, 1000)

    const timer2 = setTimeout(() => {
      router.push("/dashboard")
    }, 2000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <Loader2 className="w-12 h-12 text-noki-primary animate-spin mx-auto" />
        <p className="text-xl font-poppins text-foreground">{loadingText}</p>
      </div>
    </div>
  )
}
