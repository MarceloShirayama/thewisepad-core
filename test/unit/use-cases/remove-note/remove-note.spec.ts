import { NoteData } from "src/use-cases/ports";
import { RemoveNote } from "src/use-cases/remove-note";
import { NoteBuilder } from "test/builders/note-builder";
import { InMemoryNoteRepository } from "test/doubles/repositories";

describe("Remove note use case", () => {
  function makeSut() {
    const note: NoteData = NoteBuilder.createNote().build();

    const noteRepositoryWithNote = new InMemoryNoteRepository([note]);

    const useCase = new RemoveNote(noteRepositoryWithNote);

    return { useCase, noteRepositoryWithNote, note };
  }

  test("Should ", async () => {
    const { useCase, noteRepositoryWithNote, note } = makeSut();

    const removedNote = await useCase.perform(note.id as string);

    expect(removedNote).toBe(note);

    const findRemovedNote = await noteRepositoryWithNote.findById(
      note.id as string
    );

    expect(findRemovedNote).toBeNull();
  });
});
