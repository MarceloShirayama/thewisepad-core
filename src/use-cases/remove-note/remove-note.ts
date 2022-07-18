import { NoteData, NoteRepository, UseCase } from '@/use-cases/ports'

export class RemoveNote implements UseCase {
  constructor(private readonly _noteRepository: NoteRepository) {}

  private get noteRepository(): NoteRepository {
    return this._noteRepository
  }

  async perform(noteId: string): Promise<NoteData> {
    return this.noteRepository.remove(noteId)
  }
}
