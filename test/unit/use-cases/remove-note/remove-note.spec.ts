import { NoteData } from "src/use-cases/ports";
import { RemoveNote } from "src/use-cases/remove-note";
import { NoExistentNoteError } from "src/use-cases/remove-note/errors";
import { NoteBuilder } from "test/builders/note-builder";
import { InMemoryNoteRepository } from "test/doubles/repositories";

describe("Remove note use case", () => {
  function makeSut() {
    const note: NoteData = NoteBuilder.createNote().build();
    const anotherNote: NoteData = NoteBuilder.createNote()
      .withDifferentTitleAndId()
      .build();

    const noteRepositoryWithNote = new InMemoryNoteRepository([note]);

    const useCase = new RemoveNote(noteRepositoryWithNote);

    return { useCase, noteRepositoryWithNote, note, anotherNote };
  }

  test("Should remove existing note", async () => {
    const { useCase, noteRepositoryWithNote, note } = makeSut();

    await useCase.perform(note.id as string);

    const findRemovedNote = await noteRepositoryWithNote.findById(
      note.id as string
    );

    expect(findRemovedNote).toBeNull();
  });

  test("Should return error if removing no-existent note", async () => {
    const { useCase, noteRepositoryWithNote, note, anotherNote } = makeSut();

    const noteId = anotherNote.id as string;

    const removedNote = await useCase.perform(noteId);

    const error = removedNote.value as Error;

    expect(error).toBeInstanceOf(NoExistentNoteError);
    expect(error.message).toBe("Note does not exist.");
  });
});
