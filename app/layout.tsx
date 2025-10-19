import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Roboto } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import LayoutWrapper from "@/components/global/layout-wrapper"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "Noki",
  description: "AI-powered student planner that integrates with Canvas LMS",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.variable} ${roboto.variable}`}>
        <Suspense fallback={null}>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
