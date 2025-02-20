import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Star, Clock, Tag, Share2, Trash, Settings, Plus, Search, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { AuthButton } from "@/components/auth-button"
import { useNotes, type Note } from "@/contexts/NotesContext"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function NavigationSidebar() {
  const { dispatch } = useNotes()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('navSidebarCollapsed')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('navSidebarCollapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const handleNewNote = () => {
    const newNote: Note = {
      _id: new Date().getTime().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    dispatch({ type: "ADD_NOTE", payload: newNote })
    dispatch({ type: "SET_ACTIVE_NOTE", payload: newNote._id })
  }

  return (
    <aside className={cn(
      "border-r bg-muted/30 flex flex-col relative transition-all duration-300",
      isCollapsed ? "w-[50px]" : "w-[240px]"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-2 z-10 h-8 w-8 rounded-full border bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
      
      <div className={cn(
        "p-4 flex flex-col gap-2",
        isCollapsed && "items-center"
      )}>
        <div className={cn(
          "flex items-center px-2 mb-4",
          isCollapsed ? "justify-center" : "justify-end"
        )}>
          <AuthButton isCollapsed={isCollapsed} />
        </div>
        
        {!isCollapsed && (
          <>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search notes..."
                className="w-full pl-8 pr-4 py-2 text-sm bg-background border rounded-md"
              />
            </div>
            <Button 
              className="w-full justify-start gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" 
              variant="default" 
              onClick={handleNewNote}
            >
              <FileText className="h-4 w-4" />
              New Note
            </Button>
          </>
        )}
        
        {isCollapsed && (
          <Button
            className="w-10 h-10 p-0 bg-emerald-500 hover:bg-emerald-600 text-white"
            variant="default"
            onClick={handleNewNote}
          >
            <FileText className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1">
        <div className={cn("px-2", isCollapsed && "px-0")}>
          <div className="flex flex-col gap-1">
            {[
              { icon: Home, label: "Home" },
              { icon: Star, label: "Starred" },
              { icon: Clock, label: "Recent" },
              { icon: Tag, label: "Tags" },
              { icon: Share2, label: "Shared" },
              { icon: Trash, label: "Trash" },
              { icon: Settings, label: "Settings" },
            ].map(({ icon: Icon, label }) => (
              <Button
                key={label}
                variant="ghost"
                className={cn(
                  "justify-start gap-2",
                  isCollapsed && "w-10 h-10 p-0 mx-auto"
                )}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && label}
              </Button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  )
}
