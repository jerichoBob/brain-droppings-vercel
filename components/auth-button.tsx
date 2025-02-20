"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuthButtonProps {
  isCollapsed?: boolean
}

export function AuthButton({ isCollapsed = false }: AuthButtonProps) {
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
      <Button 
        variant="ghost" 
        size={isCollapsed ? "icon" : "sm"} 
        asChild
        className={cn(
          isCollapsed && "w-8 h-8 p-0"
        )}
      >
        <a href="/api/auth/logout">
          {isCollapsed ? (
            <LogOut className="h-4 w-4" />
          ) : (
            "Log Out"
          )}
        </a>
      </Button>
    )
  }

  return (
    <Button 
      variant="default" 
      size={isCollapsed ? "icon" : "sm"} 
      onClick={handleLogin} 
      className={cn(
        isCollapsed ? "w-8 h-8 p-0" : "w-full justify-start"
      )}
    >
      <LogIn className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
      {!isCollapsed && "Log In"}
    </Button>
  )
}
