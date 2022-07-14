import { NoteData } from '../create-note/note-data'
import { NoteRepository } from '../create-note/ports/note-repository'

export class RemoveNote {
  constructor(private readonly _noteRepository: NoteRepository) {}

  private get noteRepository(): NoteRepository {
    return this._noteRepository
  }

  async perform(noteId: string): Promise<NoteData> {
    return this.noteRepository.removeNote(noteId)
  }
}
