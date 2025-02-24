import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { RootClientWrapper } from "@/components/root-client-wrapper"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootClientWrapper>
          {children}
        </RootClientWrapper>
      </body>
    </html>
  )
}
