import { NoteData, NoteRepository } from "@/use-cases/ports";

export class RemoveNote {
  constructor(private readonly noteRepository: NoteRepository) {}

  async perform(noteId: string): Promise<NoteData | null> {
    return await this.noteRepository.remove(noteId);
  }
}
