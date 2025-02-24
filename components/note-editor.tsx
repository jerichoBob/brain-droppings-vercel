"use client"

import { useNotes } from "@/contexts/NotesContext"
import { useEffect, useState } from "react"
import { RichTextEditor } from "./rich-text-editor"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function NoteEditor() {
  const { state, dispatch } = useNotes()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (state.activeNoteId) {
      const activeNote = state.notes.find((note) => note._id === state.activeNoteId)
      if (activeNote) {
        setTitle(activeNote.title)
        setContent(activeNote.content)
      }
    } else {
      setTitle("")
      setContent("")
    }
  }, [state.activeNoteId, state.notes])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (state.activeNoteId) {
      const activeNote = state.notes.find((note) => note._id === state.activeNoteId)
      if (activeNote) {
        dispatch({
          type: "UPDATE_NOTE",
          payload: {
            ...activeNote,
            title: newTitle,
            content,
            updatedAt: new Date(),
          },
        })
      }
    }
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    if (state.activeNoteId) {
      const activeNote = state.notes.find(note => note._id === state.activeNoteId)
      if (activeNote) {
        dispatch({
          type: "UPDATE_NOTE",
          payload: {
            ...activeNote,
            title,
            content: newContent,
            updatedAt: new Date(),
          },
        })
      }
    }
  }

  const handleDelete = async () => {
    if (state.activeNoteId) {
      dispatch({
        type: "DELETE_NOTE",
        payload: state.activeNoteId,
      })
      setIsDeleteDialogOpen(false)
    }
  }

  if (!state.activeNoteId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a note or create a new one
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Title"
            className="flex-1 text-3xl font-bold bg-transparent border-none outline-none"
            value={title}
            onChange={handleTitleChange}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-600 hover:bg-red-100"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
        <RichTextEditor key={state.activeNoteId} content={content} onChange={handleContentChange} />
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
