import { MissingParamsError } from "src/presentation/controllers/errors";
import { RemoveNoteController } from "src/presentation/controllers/remove-note";
import { serverError } from "src/presentation/controllers/util";
import { RemoveNote } from "src/use-cases/remove-note";
import { NoExistentNoteError } from "src/use-cases/remove-note/errors";
import { NoteBuilder } from "test/builders/note-builder";
import { InMemoryNoteRepository } from "test/doubles/repositories";
import { makeErrorThrowingUseCaseStub } from "test/doubles/use-cases";

describe("Remove note controller", () => {
  function makeSut() {
    const validNote = NoteBuilder.createNote().build();
    const anotherValidNote = NoteBuilder.createNote()
      .withDifferentTitleAndId()
      .build();

    const noteRepositoryWithOneNote = new InMemoryNoteRepository([validNote]);

    const useCase = new RemoveNote(noteRepositoryWithOneNote);

    const controller = new RemoveNoteController(useCase);

    const errorThrowingSignInUseCaseStub = makeErrorThrowingUseCaseStub();

    const controllerWithUseCaseStub = new RemoveNoteController(
      errorThrowingSignInUseCaseStub
    );

    return {
      validNote,
      anotherValidNote,
      controller,
      controllerWithUseCaseStub,
    };
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

  it("Should return 400 if request does not contain note id", async () => {
    const { controller } = makeSut();

    const response = await controller.handle({
      body: {},
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(MissingParamsError);
    expect(response.body.message).toBe("Missing param: noteId.");
  });

  it("Should return 500 if server throws", async () => {
    const { validNote, controllerWithUseCaseStub } = makeSut();

    const response = await controllerWithUseCaseStub.handle({
      body: { noteId: validNote.id },
    });

    expect(response).toEqual(
      serverError(new Error("purposeful error for testing."))
    );
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("purposeful error for testing.");
  });
});
