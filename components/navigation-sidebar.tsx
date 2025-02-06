import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Star, Clock, Tag, Share2, Trash, Settings, Plus, Search } from "lucide-react"
import { AuthButton } from "@/components/auth-button"
import { useNotes } from "@/contexts/NotesContext"

export function NavigationSidebar() {
  const { dispatch } = useNotes()

  const handleNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: "Untitled Note",
      content: "",
      updatedAt: new Date(),
    }
    dispatch({ type: "ADD_NOTE", payload: newNote })
    dispatch({ type: "SET_ACTIVE_NOTE", payload: newNote.id })
  }

  return (
    <aside className="w-[240px] border-r bg-muted/30 flex flex-col">
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-xl font-semibold">Notes</h1>
          <AuthButton />
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search notes..."
            className="w-full pl-8 pr-4 py-2 text-sm bg-background border rounded-md"
          />
        </div>
        <Button className="w-full justify-start gap-2" variant="success" onClick={handleNewNote}>
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>
      <nav className="flex-1">
        <div className="px-2">
          <div className="flex flex-col gap-1">
            {[
              { icon: Home, label: "Home" },
              { icon: Star, label: "Starred" },
              { icon: Clock, label: "Recent" },
              { icon: Tag, label: "Tags" },
              { icon: Share2, label: "Shared" },
              { icon: Trash, label: "Trash" },
            ].map((item) => (
              <Link
                key={item.label}
                href="#"
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <div className="p-4 border-t">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </aside>
  )
}

