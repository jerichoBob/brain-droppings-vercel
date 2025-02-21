"use client"

import { formatDistanceToNow } from "date-fns"
import { Filter, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotes } from "@/contexts/NotesContext"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

function stripHtml(html: string) {
  const tmp = document.createElement("DIV")
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ""
}

export function NotesListSidebar() {
  const { state, dispatch } = useNotes()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notesListSidebarCollapsed')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('notesListSidebarCollapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  if (state.loading) {
    return (
      <div className={cn(
        "border-r flex flex-col relative transition-all duration-300",
        isCollapsed ? "w-[50px]" : "w-[300px]"
      )}>
        <div className="p-4 border-b">
          <h2 className="font-semibold">Notes</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className={cn(
        "border-r flex flex-col relative transition-all duration-300",
        isCollapsed ? "w-[50px]" : "w-[300px]"
      )}>
        <div className="p-4 border-b">
          <h2 className="font-semibold">Notes</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 text-center text-muted-foreground">
          {state.error}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "border-r flex flex-col relative transition-all duration-300",
      isCollapsed ? "w-[50px]" : "w-[300px]"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 bottom-2 z-10 h-8 w-8 rounded-full border bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && <h2 className="font-semibold">Notes</h2>}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-auto">
          {state.notes.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notes yet
            </div>
          ) : (
            state.notes.map((note) => (
              <button
                key={note._id}
                className={cn(
                  "w-full text-left p-4 border-b last:border-0 hover:bg-muted/50 transition-colors",
                  state.activeNoteId === note._id && "bg-muted"
                )}
                onClick={() => dispatch({ type: "SET_ACTIVE_NOTE", payload: note._id })}
              >
                <div className="font-medium mb-0.5">{note.title}</div>
                <div className="text-xs text-muted-foreground mb-2">
                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {stripHtml(note.content)}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
