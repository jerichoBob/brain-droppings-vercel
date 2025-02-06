"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface Note {
  id: number
  title: string
  content: string
  updatedAt: Date
}

interface NotesState {
  notes: Note[]
  activeNoteId: number | null
}

type NotesAction =
  | { type: "ADD_NOTE"; payload: Note }
  | { type: "UPDATE_NOTE"; payload: Note }
  | { type: "DELETE_NOTE"; payload: number }
  | { type: "SET_ACTIVE_NOTE"; payload: number }

const initialState: NotesState = {
  notes: [],
  activeNoteId: null,
}

function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case "ADD_NOTE":
      return { ...state, notes: [...state.notes, action.payload] }
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((note) => (note.id === action.payload.id ? action.payload : note)),
      }
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
        activeNoteId: state.activeNoteId === action.payload ? null : state.activeNoteId,
      }
    case "SET_ACTIVE_NOTE":
      return { ...state, activeNoteId: action.payload }
    default:
      return state
  }
}

const NotesContext = createContext<
  | {
      state: NotesState
      dispatch: React.Dispatch<NotesAction>
    }
  | undefined
>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notesReducer, initialState)

  return <NotesContext.Provider value={{ state, dispatch }}>{children}</NotesContext.Provider>
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider")
  }
  return context
}

