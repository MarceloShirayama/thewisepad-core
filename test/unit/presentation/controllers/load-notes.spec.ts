import { LoadNotesController } from "src/presentation/controllers";
import { MissingParamsError } from "src/presentation/controllers/errors";
import { LoadNotes } from "src/use-cases/load-notes";
import { NoteBuilder, UserBuilder } from "test/builders";
import { InMemoryNoteRepository } from "test/doubles/repositories";
import { makeErrorThrowingUseCaseStub } from "test/doubles/use-cases";

describe("Load notes controller", () => {
  function makeSut() {
    const note1 = NoteBuilder.createNote().build();
    const note2 = NoteBuilder.createNote().withDifferentTitleAndId().build();

    const valiUser = UserBuilder.createUser().build();

    const noteRepositoryWithTwoNotes = new InMemoryNoteRepository([
      note1,
      note2,
    ]);

    const useCase = new LoadNotes(noteRepositoryWithTwoNotes);
    const useCaseStub = makeErrorThrowingUseCaseStub();

    const controller = new LoadNotesController(useCase);
    const controllerWithUseCaseStub = new LoadNotesController(useCaseStub);

    return {
      controller,
      controllerWithUseCaseStub,
      valiUser,
      note1,
      note2,
    };
  }

  it("Should return 200 and notes for valid user", async () => {
    const { controller, valiUser, note1, note2 } = makeSut();

    const request = {
      body: { userId: valiUser.id },
    };

    const response = await controller.handle(request);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual(expect.arrayContaining([note1, note2]));
  });

  it("Should return 400 if request does not contain user id", async () => {
    const { controller } = makeSut();

    const request = { body: {} };

    const response = await controller.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(MissingParamsError);
  });

  it("Should return 500 if load notes use case throws", async () => {
    const { controllerWithUseCaseStub, valiUser } = makeSut();

    const request = {
      body: {
        userId: valiUser.id,
      },
    };

    const response = await controllerWithUseCaseStub.handle(request);

    expect(response.statusCode).toBe(500);
  });
});
