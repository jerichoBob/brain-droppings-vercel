import { ObjectId } from 'mongodb'

export interface Note {
  _id?: ObjectId
  title: string
  content: string
  notebookId?: ObjectId
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Notebook {
  _id?: ObjectId
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  _id?: ObjectId
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}
