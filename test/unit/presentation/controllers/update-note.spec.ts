import { InvalidTitleError } from "src/entities/errors";
import { MissingParamsError } from "src/presentation/controllers/errors";
import { HttpRequest } from "src/presentation/controllers/ports";
import { UpdateNoteController } from "src/presentation/controllers/update-note";
import { NoExistentNoteError } from "src/use-cases/remove-note/errors";
import { UpdateNote, UpdateNoteRequest } from "src/use-cases/update-note";
import { NoteBuilder, UserBuilder } from "test/builders";
import {
  InMemoryNoteRepository,
  InMemoryUserRepository,
} from "test/doubles/repositories";
import { makeErrorThrowingUseCaseStub } from "test/doubles/use-cases";

describe("Update note controller", () => {
  const originalNoteData = NoteBuilder.createNote().build();

  const changeNoteData = NoteBuilder.createNote()
    .withDifferentTitleAndContent()
    .build();

  const anotherNoteData = NoteBuilder.createNote()
    .withDifferentTitleAndId()
    .build();

  const requestWithoutNoteId = {
    body: {
      title: changeNoteData.title,
      content: changeNoteData.content,
      ownerEmail: originalNoteData.ownerEmail,
      ownerId: originalNoteData.ownerId as string,
    },
  };

  const requestWithoutNoteOwnerEmail = {
    body: {
      title: changeNoteData.title,
      content: changeNoteData.content,
      id: originalNoteData.id as string,
      ownerId: originalNoteData.ownerId as string,
    },
  };

  const requestWithoutNoteOwnerId = {
    body: {
      title: changeNoteData.title,
      content: changeNoteData.content,
      id: originalNoteData.id as string,
      ownerEmail: originalNoteData.ownerEmail,
    },
  };

  const requestWithoutNoteParams = {
    body: {
      title: changeNoteData.title,
      content: changeNoteData.content,
    },
  };

  function makeSut() {
    const owner = UserBuilder.createUser().build();

    const noteRepositoryWithANote = new InMemoryNoteRepository([
      originalNoteData,
    ]);

    const userRepositoryWithAUser = new InMemoryUserRepository([owner]);

    const useCase = new UpdateNote(
      noteRepositoryWithANote,
      userRepositoryWithAUser
    );

    const controller = new UpdateNoteController(useCase);

    const errorThrowingSignInUseCaseStub = makeErrorThrowingUseCaseStub();

    const controllerWithStubUseCase = new UpdateNoteController(
      errorThrowingSignInUseCaseStub
    );

    return { controller, controllerWithStubUseCase };
  }

  it("Should return 200 and updated note when note is updated", async () => {
    const { controller } = makeSut();

    const updateNoteRequest: UpdateNoteRequest = {
      title: changeNoteData.title,
      content: changeNoteData.content,
      id: originalNoteData.id as string,
      ownerEmail: originalNoteData.ownerEmail,
      ownerId: originalNoteData.ownerId as string,
    };

    const request: HttpRequest = {
      body: updateNoteRequest,
    };

    const response = await controller.specificOp(request);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(updateNoteRequest);
  });

  it.only("Should return 400 when trying to update non-existent note", async () => {
    const { controller } = makeSut();

    const updateAnotherNoteRequest: UpdateNoteRequest = {
      id: anotherNoteData.id as string,
      title: anotherNoteData.title,
      ownerEmail: anotherNoteData.ownerEmail,
      ownerId: anotherNoteData.ownerId as string,
    };

    const request: HttpRequest = {
      body: updateAnotherNoteRequest,
    };

    const response = await controller.specificOp(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(NoExistentNoteError);
  });

  it("Should return 400 when trying to update note with invalid title", async () => {
    const { controller } = makeSut();

    const updateNoteRequest: UpdateNoteRequest = {
      title: "",
      id: originalNoteData.id as string,
      ownerEmail: originalNoteData.ownerEmail,
      ownerId: originalNoteData.ownerId as string,
    };

    const request: HttpRequest = {
      body: updateNoteRequest,
    };

    const response = await controller.specificOp(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(InvalidTitleError);
  });

  it("Should return 400 when request does not contain title nor content", async () => {
    const { controller } = makeSut();

    const updateNoteRequest: UpdateNoteRequest = {
      id: originalNoteData.id as string,
      ownerEmail: originalNoteData.ownerEmail,
      ownerId: originalNoteData.ownerId as string,
    };

    const request: HttpRequest = {
      body: updateNoteRequest,
    };

    const response = await controller.specificOp(request);

    const error = response.body as Error;

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(MissingParamsError);
    expect(error.message).toBe("Missing param: title, content.");
  });

  it.each([
    requestWithoutNoteId,
    requestWithoutNoteOwnerEmail,
    requestWithoutNoteOwnerId,
    requestWithoutNoteParams,
  ])(
    "Should return 400 when request does not contain note required params",
    async (request) => {
      const { controller } = makeSut();

      const response = await controller.specificOp(request);

      const error = response.body as Error;

      expect(response.statusCode).toBe(400);
      expect(response.body).toBeInstanceOf(MissingParamsError);
      expect(error.message).toEqual(expect.stringContaining("Missing param: "));
    }
  );

  it("Should return 500 if an error is raised internally", async () => {
    const { controllerWithStubUseCase } = makeSut();

    const updateNoteRequest: UpdateNoteRequest = {
      title: changeNoteData.title,
      content: changeNoteData.content,
      id: originalNoteData.id as string,
      ownerEmail: originalNoteData.ownerEmail,
      ownerId: originalNoteData.ownerId as string,
    };

    const request: HttpRequest = {
      body: updateNoteRequest,
    };

    const response = await controllerWithStubUseCase.specificOp(request);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeInstanceOf(Error);
  });
});
