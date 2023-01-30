import { NoteData, NoteRepository, UseCase } from "../../use-cases/ports";

export class RemoveNote implements UseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async perform(noteId: string): Promise<NoteData | null> {
    return await this.noteRepository.remove(noteId);
  }
}
