import { RemoveNoteController } from "src/presentation/controllers/remove-note";
import { RemoveNote } from "src/use-cases/remove-note";
import { NoExistentNoteError } from "src/use-cases/remove-note/errors";
import { NoteBuilder } from "test/builders/note-builder";
import { InMemoryNoteRepository } from "test/doubles/repositories";

describe("Remove note controller", () => {
  function makeSut() {
    const validNote = NoteBuilder.createNote().build();
    const anotherValidNote = NoteBuilder.createNote()
      .withDifferentTitleAndId()
      .build();

    const noteRepositoryWithOneNote = new InMemoryNoteRepository([validNote]);

    const useCase = new RemoveNote(noteRepositoryWithOneNote);

    const controller = new RemoveNoteController(useCase);

    return { validNote, anotherValidNote, controller };
  }

  it("Should return 200 if successfully removing note", async () => {
    const { validNote, controller } = makeSut();

    const response = await controller.handle({
      body: { noteId: validNote.id },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(validNote);
  });

  it("Should return 400 in an attempt to remove the non-existing note", async () => {
    const { anotherValidNote, controller } = makeSut();

    const response = await controller.handle({
      body: { noteId: anotherValidNote.id },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(NoExistentNoteError);
  });
});
