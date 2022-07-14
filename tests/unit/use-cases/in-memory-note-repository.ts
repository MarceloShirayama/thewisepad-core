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

  async addNote(note: NoteData): Promise<NoteData> {
    note.id = randomUUID()
    this.data.push(note)

    return note
  }

  async findAllNotesFrom(userId: string): Promise<NoteData[]> {
    const notes = this.data.filter((note) => note.ownerId === userId)

    return notes
  }

  async findNoteById(noteId: string): Promise<NoteData> {
    const note = this.data.find((note) => note.id === noteId) as NoteData

    return note || null
  }

  async removeNote(noteId: string): Promise<NoteData> {
    const noteToRemoved = this.data.find(
      (note) => note.id === noteId
    ) as NoteData

    if (noteToRemoved) {
      this.data.splice(this.data.indexOf(noteToRemoved), 1)
    }

    return noteToRemoved || null
  }
}
