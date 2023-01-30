import { NoteData, NoteRepository, UseCase } from "../../use-cases/ports";

export class LoadNotesForUser implements UseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async perform(requestUserId: string): Promise<NoteData[]> {
    const notes = await this.noteRepository.findAllNotesFrom(requestUserId);

    return notes;
  }
}
