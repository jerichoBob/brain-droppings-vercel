import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { UserProvider } from "@auth0/nextjs-auth0/client"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={inter.className}>{children}</body>
      </UserProvider>
    </html>
  )
}

