"use client"

import { NavigationSidebar } from "@/components/navigation-sidebar"
import { NotesProvider } from "@/contexts/NotesContext"

export function RootClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <NotesProvider>
      <div className="flex h-screen bg-background">
        <NavigationSidebar />
        {children}
      </div>
    </NotesProvider>
  )
}
