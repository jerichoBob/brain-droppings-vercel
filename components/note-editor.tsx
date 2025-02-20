"use client"

import { useNotes } from "@/contexts/NotesContext"
import { useEffect, useState } from "react"
import { RichTextEditor } from "./rich-text-editor"
import type React from "react"

export function NoteEditor() {
  const { state, dispatch } = useNotes()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

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

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        <input
          type="text"
          placeholder="Title"
          className="w-full text-3xl font-bold bg-transparent border-none outline-none mb-4"
          value={title}
          onChange={handleTitleChange}
        />
        <RichTextEditor key={state.activeNoteId} content={content} onChange={handleContentChange} />
      </div>
    </div>
  )
}
