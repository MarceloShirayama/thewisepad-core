import { Either, left, right } from "src/shared";
import { NoteData, NoteRepository, UseCase } from "../../use-cases/ports";
import { NoExistentNoteError } from "./errors";

export class RemoveNote implements UseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async perform(
    noteId: string
  ): Promise<Either<NoExistentNoteError, NoteData>> {
    const noteExists = await this.noteRepository.findById(noteId);

    if (noteExists) {
      const noteToRemove = (await this.noteRepository.remove(
        noteId
      )) as NoteData;
      return right(noteToRemove);
    }

    return left(new NoExistentNoteError());
  }
}
