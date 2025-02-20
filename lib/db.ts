import { ObjectId } from 'mongodb'
import clientPromise from './mongodb'
import { Note, Notebook, User } from './types'

export async function getDb() {
  const client = await clientPromise
  return client.db(process.env.MONGODB_DB)
}

// Note functions
export async function createNote(note: Omit<Note, '_id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb()
  const now = new Date()
  const result = await db.collection('notes').insertOne({
    ...note,
    createdAt: now,
    updatedAt: now,
  })
  return result.insertedId
}

export async function updateNote(id: string, note: Partial<Note>) {
  const db = await getDb()
  const result = await db.collection('notes').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...note,
        updatedAt: new Date()
      }
    }
  )
  return result.modifiedCount > 0
}

export async function deleteNote(id: string) {
  const db = await getDb()
  const result = await db.collection('notes').deleteOne({
    _id: new ObjectId(id)
  })
  return result.deletedCount > 0
}

export async function getNoteById(id: string) {
  const db = await getDb()
  return await db.collection('notes').findOne({ _id: new ObjectId(id) })
}

export async function getNotesByNotebook(notebookId: string) {
  const db = await getDb()
  return await db.collection('notes')
    .find({ notebookId: new ObjectId(notebookId) })
    .sort({ updatedAt: -1 })
    .toArray()
}

export async function getAllNotes() {
  const db = await getDb()
  return await db.collection('notes')
    .find()
    .sort({ updatedAt: -1 })
    .toArray()
}

// Notebook functions
export async function createNotebook(notebook: Omit<Notebook, '_id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb()
  const now = new Date()
  const result = await db.collection('notebooks').insertOne({
    ...notebook,
    createdAt: now,
    updatedAt: now,
  })
  return result.insertedId
}

export async function updateNotebook(id: string, notebook: Partial<Notebook>) {
  const db = await getDb()
  const result = await db.collection('notebooks').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...notebook,
        updatedAt: new Date()
      }
    }
  )
  return result.modifiedCount > 0
}

export async function deleteNotebook(id: string) {
  const db = await getDb()
  // First delete all notes in the notebook
  await db.collection('notes').deleteMany({
    notebookId: new ObjectId(id)
  })
  // Then delete the notebook
  const result = await db.collection('notebooks').deleteOne({
    _id: new ObjectId(id)
  })
  return result.deletedCount > 0
}

export async function getNotebookById(id: string) {
  const db = await getDb()
  return await db.collection('notebooks').findOne({ _id: new ObjectId(id) })
}

export async function getAllNotebooks() {
  const db = await getDb()
  return await db.collection('notebooks')
    .find()
    .sort({ updatedAt: -1 })
    .toArray()
}

// User functions
export async function createUser(user: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb()
  const now = new Date()
  const result = await db.collection('users').insertOne({
    ...user,
    createdAt: now,
    updatedAt: now,
  })
  return result.insertedId
}

export async function getUserByEmail(email: string) {
  const db = await getDb()
  return await db.collection('users').findOne({ email })
}

export async function updateUser(id: string, user: Partial<User>) {
  const db = await getDb()
  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...user,
        updatedAt: new Date()
      }
    }
  )
  return result.modifiedCount > 0
}
