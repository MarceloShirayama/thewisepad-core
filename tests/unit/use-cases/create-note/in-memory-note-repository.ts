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
}
