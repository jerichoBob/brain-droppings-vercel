import { NextResponse } from 'next/server'
import { createNote, getAllNotes, updateNote, deleteNote } from '@/lib/db'
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

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json()
    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      )
    }
    
    const success = await updateNote(id, updates)
    if (!success) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      )
    }
    
    const success = await deleteNote(id)
    if (!success) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    )
  }
}
