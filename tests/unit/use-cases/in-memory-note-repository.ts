import { randomUUID } from 'crypto'

import { NoteData } from '@/use-cases/ports/note-data'
import { NoteRepository } from '@/use-cases/ports/note-repository'

export class InMemoryNoteRepository implements NoteRepository {
  private readonly _data: NoteData[]

  constructor(data: NoteData[]) {
    this._data = data
  }

  get data(): NoteData[] {
    return this._data
  }

  async add(note: NoteData): Promise<NoteData> {
    note.id = randomUUID()
    this.data.push(note)

    return note
  }

  async findAllFrom(userId: string): Promise<NoteData[]> {
    const notes = this.data.filter((note) => note.ownerId === userId)

    return notes
  }

  async findById(noteId: string): Promise<NoteData> {
    const note = this.data.find((note) => note.id === noteId) as NoteData

    return note || null
  }

  async remove(noteId: string): Promise<NoteData> {
    const noteToRemoved = this.data.find(
      (note) => note.id === noteId
    ) as NoteData

    if (noteToRemoved) {
      this.data.splice(this.data.indexOf(noteToRemoved), 1)
    }

    return noteToRemoved || null
  }

  async updateTitle(noteId: string, newTitle: string): Promise<Boolean> {
    const originalNote = await this.findById(noteId)

    if (!originalNote) {
      return false
    }

    originalNote.title = newTitle

    return true
  }

  async updateContent(noteId: string, newContent: string): Promise<Boolean> {
    const originalNote = await this.findById(noteId)

    if (!originalNote) {
      return false
    }

    originalNote.content = newContent

    return true
  }
}
