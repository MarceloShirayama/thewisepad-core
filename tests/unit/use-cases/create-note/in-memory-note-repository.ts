import { NoteData } from '@/use-cases/create-note/note-data'
import { NoteRepository } from '@/use-cases/create-note/ports/note-repository'

export class InMemoryNoteRepository implements NoteRepository {
  private readonly _data: NoteData[]

  constructor(data: NoteData[]) {
    this._data = data
  }

  get data(): NoteData[] {
    return this._data
  }

  async addNote(note: NoteData): Promise<NoteData> {
    note.id = this.data.length.toString()
    this.data.push(note)

    return note
  }

  async findAllNotesFrom(userId: string): Promise<NoteData[]> {
    return this.data.filter((note) => note.ownerId === userId)
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
