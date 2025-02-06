"use client"

import { formatDistanceToNow } from "date-fns"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotes } from "@/contexts/NotesContext"

function stripHtml(html: string) {
  const tmp = document.createElement("DIV")
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ""
}

export function NotesListSidebar() {
  const { state, dispatch } = useNotes()

  return (
    <div className="w-[300px] border-r flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Notes</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        {state.notes.map((note) => (
          <button
            key={note.id}
            className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
              state.activeNoteId === note.id ? "bg-muted" : ""
            }`}
            onClick={() => dispatch({ type: "SET_ACTIVE_NOTE", payload: note.id })}
          >
            <div className="flex flex-col gap-1">
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{stripHtml(note.content)}</p>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

