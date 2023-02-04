import { InvalidTitleError } from "src/entities/errors";
import { HttpRequest } from "src/presentation/controllers/ports";
import { UpdateNoteController } from "src/presentation/controllers/update-note";
import { UpdateNote, UpdateNoteRequest } from "src/use-cases/update-note";
import { NoteBuilder } from "test/builders/note-builder";
import { UserBuilder } from "test/builders/user-builder";
import {
  InMemoryNoteRepository,
  InMemoryUserRepository,
} from "test/doubles/repositories";

describe("Update note controller", () => {
  function makeSut() {
    const originalNoteData = NoteBuilder.createNote().build();
    const changeNoteData = NoteBuilder.createNote()
      .withDifferentTitleAndContent()
      .build();

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

    return { originalNoteData, changeNoteData, controller };
  }

  it("Should return 200 and updated note when note is updated", async () => {
    const { originalNoteData, changeNoteData, controller } = makeSut();

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

    const response = await controller.handle(request);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(updateNoteRequest);
  });

  it("Should return 400 when trying to update note with invalid title", async () => {
    const { originalNoteData, controller } = makeSut();

    const updateNoteRequest: UpdateNoteRequest = {
      title: "",
      id: originalNoteData.id as string,
      ownerEmail: originalNoteData.ownerEmail,
      ownerId: originalNoteData.ownerId as string,
    };

    const request: HttpRequest = {
      body: updateNoteRequest,
    };

    const response = await controller.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(InvalidTitleError);
  });
});
