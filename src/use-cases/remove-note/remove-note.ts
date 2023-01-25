import { NoteData } from "@/use-cases/ports/note-data";
import { NoteRepository } from "../ports/note-repository";

export class RemoveNote {
  constructor(private readonly noteRepository: NoteRepository) {}

  async perform(noteId: string): Promise<NoteData | null> {
    return await this.noteRepository.remove(noteId);
  }
}
