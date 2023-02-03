import { CreateNoteController } from "src/presentation/controllers/create-note";
import { MissingParamsError } from "src/presentation/controllers/errors";
import { HttpRequest } from "src/presentation/controllers/ports";
import { CreateNote } from "src/use-cases/create-note";
import { NoteBuilder } from "test/builders/note-builder";
import { UserBuilder } from "test/builders/user-builder";
import {
  InMemoryNoteRepository,
  InMemoryUserRepository,
} from "test/doubles/repositories";

describe("Create note controller", () => {
  function makeSut() {
    const validUser = UserBuilder.createUser().build();

    const validNote = NoteBuilder.createNote().build();

    const emptyNoteRepository = new InMemoryNoteRepository([]);

    const userRepositoryWithSingleUser = new InMemoryUserRepository([
      validUser,
    ]);

    const createNoteUseCase = new CreateNote(
      emptyNoteRepository,
      userRepositoryWithSingleUser
    );

    const controller = new CreateNoteController(createNoteUseCase);

    return { controller, validNote, emptyNoteRepository };
  }

  it("Should return 201 when note is successfully created", async () => {
    const { controller, validNote, emptyNoteRepository } = makeSut();

    const validRequest: HttpRequest = {
      body: {
        title: validNote.title,
        content: validNote.content,
        ownerEmail: validNote.ownerEmail,
      },
    };

    const response = await controller.handle(validRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(validNote);

    const notesInRepository = await emptyNoteRepository.findAllNotesFrom(
      validNote.id as string
    );
    expect(notesInRepository.length).toBe(1);
    expect(notesInRepository[0]).toEqual(validNote);
  });

  it("Should return 400 when title is missing from the request", async () => {
    const { controller, validNote } = makeSut();

    const requestWithoutTitle: HttpRequest = {
      body: {
        content: validNote.content,
        ownerEmail: validNote.ownerEmail,
      },
    };

    const response = await controller.handle(requestWithoutTitle);

    const error = response.body as Error;

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(MissingParamsError);
    expect(error.message).toBe("Missing param: title.");
  });

  it("Should return 400 when content is missing from the request", async () => {
    const { controller, validNote } = makeSut();

    const requestWithoutContent: HttpRequest = {
      body: {
        title: validNote.title,
        ownerEmail: validNote.ownerEmail,
      },
    };

    const response = await controller.handle(requestWithoutContent);

    const error = response.body as Error;

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(MissingParamsError);
    expect(error.message).toBe("Missing param: content.");
  });

  it("Should return 400 when ownerEmail is missing from the request", async () => {
    const { controller, validNote } = makeSut();

    const requestWithoutOwnerEmail: HttpRequest = {
      body: {
        title: validNote.title,
        content: validNote.content,
      },
    };

    const response = await controller.handle(requestWithoutOwnerEmail);

    const error = response.body as Error;

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(MissingParamsError);
    expect(error.message).toBe("Missing param: ownerEmail.");
  });

  it("Should return 400 when params is missing from the request", async () => {
    const { controller } = makeSut();

    const requestWithoutParams: HttpRequest = {
      body: {},
    };

    const response = await controller.handle(requestWithoutParams);

    const error = response.body as Error;

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(MissingParamsError);
    expect(error.message).toBe("Missing param: title, content, ownerEmail.");
  });
});
