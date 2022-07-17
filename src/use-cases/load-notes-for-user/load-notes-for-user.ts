import { NoteData, NoteRepository } from '@/use-cases/ports'

export class LoadNotesForUser {
  constructor(private readonly notesRepository: NoteRepository) {}

  async perform(requestUserId: string): Promise<NoteData[]> {
    const notes = await this.notesRepository.findAllFromUserId(requestUserId)

    return notes
  }
}
