import { NoteData } from "@/use-cases/ports/note-data";
import { NoteRepository } from "@/use-cases/ports/note-repository";

export class LoadNotesForUser {
  constructor(private readonly noteRepository: NoteRepository) {}

  async perform(requestUserId: string): Promise<NoteData[]> {
    const notes = await this.noteRepository.findAllNotesFrom(requestUserId);

    return notes;
  }
}
