import { NoteData } from '../create-note/note-data'
import { NoteRepository } from '../create-note/ports/note-repository'

export class LoadNotesForUser {
  constructor(private readonly notesRepository: NoteRepository) {}

  async perform(requestUserId: string): Promise<NoteData[]> {
    const notes = await this.notesRepository.findAllNotesFrom(requestUserId)

    return notes
  }
}
