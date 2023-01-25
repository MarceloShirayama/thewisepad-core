import { NoteData } from "@/entities/note-data";
import { NoteRepository } from "../ports/note-repository";

export class LoadNotesForUser {
  constructor(private readonly noteRepository: NoteRepository) {}

  async perform(requestUserId: string): Promise<NoteData[]> {
    const notes = await this.noteRepository.findAllNotesFrom(requestUserId);

    return notes;
  }
}
