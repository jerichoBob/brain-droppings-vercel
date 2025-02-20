"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { ObjectId } from "mongodb"

export interface Note {
  _id: string
  title: string
  content: string
  updatedAt: Date
  createdAt: Date
  notebookId?: string
  tags?: string[]
}

interface NotesState {
  notes: Note[]
  activeNoteId: string | null
  loading: boolean
  error: string | null
}

type NotesAction =
  | { type: "SET_NOTES"; payload: Note[] }
  | { type: "ADD_NOTE"; payload: Note }
  | { type: "UPDATE_NOTE"; payload: Note }
  | { type: "DELETE_NOTE"; payload: string }
  | { type: "SET_ACTIVE_NOTE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }

const initialState: NotesState = {
  notes: [],
  activeNoteId: null,
  loading: true,
  error: null,
}

function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case "SET_NOTES":
      return { ...state, notes: action.payload, loading: false }
    case "ADD_NOTE":
      return { ...state, notes: [...state.notes, action.payload] }
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((note) => (note._id === action.payload._id ? action.payload : note)),
      }
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload),
        activeNoteId: state.activeNoteId === action.payload ? null : state.activeNoteId,
      }
    case "SET_ACTIVE_NOTE":
      return { ...state, activeNoteId: action.payload }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}

const NotesContext = createContext<{
  state: NotesState
  dispatch: React.Dispatch<NotesAction>
} | null>(null)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notesReducer, initialState)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes')
        if (!response.ok) throw new Error('Failed to fetch notes')
        const notes = await response.json()
        dispatch({ type: 'SET_NOTES', payload: notes })
      } catch (error) {
        console.error('Error fetching notes:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load notes' })
      }
    }

    fetchNotes()
  }, [])

  return (
    <NotesContext.Provider value={{ state, dispatch }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider')
  }
  return context
}
