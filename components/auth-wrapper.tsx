"use client"

import { UserProvider } from "@auth0/nextjs-auth0/client"
import type React from "react" // Added import for React

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>
}

