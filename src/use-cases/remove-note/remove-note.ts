import { NoteData, NoteRepository } from '@/use-cases/ports'

export class RemoveNote {
  constructor(private readonly _noteRepository: NoteRepository) {}

  private get noteRepository(): NoteRepository {
    return this._noteRepository
  }

  async perform(noteId: string): Promise<NoteData> {
    return this.noteRepository.remove(noteId)
  }
}
