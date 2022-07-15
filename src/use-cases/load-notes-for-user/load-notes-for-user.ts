import { NoteData } from '../ports/note-data'
import { NoteRepository } from '../ports/note-repository'

export class LoadNotesForUser {
  constructor(private readonly notesRepository: NoteRepository) {}

  async perform(requestUserId: string): Promise<NoteData[]> {
    const notes = await this.notesRepository.findAllFromUserId(requestUserId)

    return notes
  }
}
