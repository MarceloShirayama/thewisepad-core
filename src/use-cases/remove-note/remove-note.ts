import { Either, left, right } from "../../shared";
import { NoteData, NoteRepository, UseCase } from "../../use-cases/ports";
import { NoExistentNoteError } from "./errors";

export class RemoveNote implements UseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async perform(noteId: string): Promise<Either<NoExistentNoteError, void>> {
    const noteExists = await this.noteRepository.findById(noteId);

    if (noteExists) {
      const removedNote = await this.noteRepository.remove(noteId);
      return right(removedNote);
    }

    return left(new NoExistentNoteError());
  }
}
