"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"

export function AuthButton() {
  const { user, isLoading } = useUser()

  const handleLogin = async () => {
    try {
      window.location.href = "/api/auth/login"
    } catch (error) {
      console.error("Login failed", error)
    }
  }

  if (isLoading) return <div>Loading...</div>

  if (user) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <a href="/api/auth/logout">Log Out</a>
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogin}>
      Log In
    </Button>
  )
}

