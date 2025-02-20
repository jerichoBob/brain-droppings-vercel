import { NextResponse } from 'next/server'
import { createNote, getAllNotes } from '@/lib/db'
import { Note } from '@/lib/types'

export async function GET() {
  try {
    const notes = await getAllNotes()
    
    // If notes is an empty array, return 204 No Content
    if (notes.length === 0) {
      return NextResponse.json([], { status: 204 })
    }
    
    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    
    // Check if it's a MongoDB connection error
    if (error instanceof Error && 
        (error.message.includes('connect') || error.message.includes('MongoClient'))) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 } // Service Unavailable
      )
    }
    
    // For all other errors
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const noteId = await createNote(body)
    return NextResponse.json({ id: noteId })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
