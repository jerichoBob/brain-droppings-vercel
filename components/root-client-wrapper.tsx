"use client"

import { NavigationSidebar } from "@/components/navigation-sidebar"
import { NotesProvider } from "@/contexts/NotesContext"
import { UserProvider } from "@auth0/nextjs-auth0/client"

export function RootClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <NotesProvider>
        <div className="flex h-screen bg-background">
          <NavigationSidebar />
          {children}
        </div>
      </NotesProvider>
    </UserProvider>
  )
}
