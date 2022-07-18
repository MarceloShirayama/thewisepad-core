import { NoteData, NoteRepository, UseCase } from '@/use-cases/ports'

export class LoadNotesForUser implements UseCase {
  constructor(private readonly notesRepository: NoteRepository) {}

  async perform(requestUserId: string): Promise<NoteData[]> {
    const notes = await this.notesRepository.findAllFromUserId(requestUserId)

    return notes
  }
}
