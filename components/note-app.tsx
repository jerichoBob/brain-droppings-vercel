"use client"

import { NoteEditor } from "@/components/note-editor"
import { NavigationSidebar } from "@/components/navigation-sidebar"
import { NotesListSidebar } from "@/components/notes-list-sidebar"
import { Toolbar } from "@/components/toolbar"
import { NotesProvider } from "@/contexts/NotesContext"

export function NoteApp() {
  return (
    <NotesProvider>
      <div className="flex h-screen bg-background">
        <NavigationSidebar />
        <NotesListSidebar />
        <main className="flex-1 flex flex-col">
          <Toolbar />
          <NoteEditor />
        </main>
      </div>
    </NotesProvider>
  )
}

