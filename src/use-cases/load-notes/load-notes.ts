import { NoteData, NoteRepository, UseCase } from "../ports";

export class LoadNotes implements UseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async perform(requestUserId: string): Promise<NoteData[]> {
    const notes = await this.noteRepository.findAllNotesFrom(requestUserId);

    return notes;
  }
}
