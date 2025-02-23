"use client"

import { NoteEditor } from "@/components/note-editor"
import { SecondarySidebar } from "@/components/secondary-sidebar"
import { Toolbar } from "@/components/toolbar"
import { usePathname } from "next/navigation"
import { HomeContent } from "@/components/home-content"
import { NotebookManager } from "@/components/notebook-manager"
import { ImportContent } from "@/components/import-content"
import { useNotes } from "@/contexts/NotesContext"
import { useEffect } from "react"

export function NoteApp() {
  const pathname = usePathname()
  const { state, dispatch } = useNotes()

  useEffect(() => {
    if (pathname === '/notes' && state.notes.length > 0 && !state.activeNoteId) {
      // Sort notes by updatedAt and get the most recent one
      const sortedNotes = [...state.notes].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      dispatch({ type: "SET_ACTIVE_NOTE", payload: sortedNotes[0]._id })
    }
  }, [pathname, state.notes, state.activeNoteId, dispatch])

  const renderContent = () => {
    switch (pathname) {
      case '/':
      case '/home':
        return (
          <>
            <SecondarySidebar />
            <main className="flex-1 flex flex-col">
              <HomeContent />
            </main>
          </>
        )
      case '/notes':
        return (
          <>
            <SecondarySidebar />
            <main className="flex-1 flex flex-col">
              <Toolbar />
              <NoteEditor />
            </main>
          </>
        )
      case '/notebooks':
        return (
          <>
            <main className="flex-1 flex flex-col">
              <NotebookManager />
            </main>
          </>
        )        
      case '/import':
        return (
          <>
            <main className="flex-1 flex flex-col">
              <ImportContent />
            </main>
          </>
        )
      default:
        return <HomeContent />
    }
  }

  return renderContent()
}
