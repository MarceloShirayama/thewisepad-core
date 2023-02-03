import { InvalidTitleError } from "src/entities/errors";
import { ExistingTitleError } from "src/use-cases/create-note/errors";
import { NoteData, UserData } from "src/use-cases/ports";
import { UpdateNote, UpdateNoteRequest } from "src/use-cases/update-note";
import { NoteBuilder } from "test/builders/note-builder";
import { UserBuilder } from "test/builders/user-builder";
import {
  InMemoryNoteRepository,
  InMemoryUserRepository,
} from "test/doubles/repositories";

describe("Update note use case", () => {
  function makeSut() {
    const validUser: UserData = UserBuilder.createUser().build();

    const originalNote: NoteData = NoteBuilder.createNote().build();

    const changedNote: NoteData = NoteBuilder.createNote()
      .withDifferentTitleAndContent()
      .build();

    const noteRepositoryWithANote = new InMemoryNoteRepository([originalNote]);

    const userRepositoryWithAUser = new InMemoryUserRepository([validUser]);

    const useCase = new UpdateNote(
      noteRepositoryWithANote,
      userRepositoryWithAUser
    );

    return { useCase, originalNote, changedNote };
  }

  it("Should update title and content of existing note", async () => {
    const { useCase, originalNote, changedNote } = makeSut();

    const updateNoteRequest: UpdateNoteRequest = {
      title: changedNote.title,
      content: changedNote.content,
      id: changedNote.id as string,
      ownerEmail: changedNote.ownerEmail,
      ownerId: changedNote.ownerId as string,
    };

    const response = await useCase.perform(updateNoteRequest);

    const responseData = response.value as NoteData;

    expect(responseData.title).toBe(updateNoteRequest.title);
    expect(responseData.content).toBe(updateNoteRequest.content);
    expect(originalNote.id).toBe(updateNoteRequest.id);
  });

  it(`Should not update title of existing note if user already has note with
    same title`, async () => {
    const { useCase, originalNote, changedNote } = makeSut();

    const updateNoteRequest: UpdateNoteRequest = {
      title: originalNote.title,
      content: changedNote.content,
      id: changedNote.id as string,
      ownerEmail: changedNote.ownerEmail,
      ownerId: changedNote.ownerId as string,
    };

    const response = await useCase.perform(updateNoteRequest);

    const error = response.value as Error;

    expect(error).toBeInstanceOf(ExistingTitleError);
    expect(error.message).toBe("User already has note with the same title.");
  });

  it("Should update only content of existing note", async () => {
    const { useCase, originalNote, changedNote } = makeSut();

    const updateNoteRequest: UpdateNoteRequest = {
      content: changedNote.content,
      id: originalNote.id as string,
      ownerEmail: originalNote.ownerEmail,
      ownerId: originalNote.ownerId as string,
    };

    const response = await useCase.perform(updateNoteRequest);

    expect(response.value).toEqual(
      expect.objectContaining({
        title: originalNote.title,
        content: changedNote.content,
        ownerEmail: originalNote.ownerEmail,
        ownerId: originalNote.ownerId,
        id: originalNote.id,
      })
    );
  });

  it("Should not update title with invalid title", async () => {
    const { useCase, changedNote } = makeSut();

    const updateNoteRequest: UpdateNoteRequest = {
      title: "ab",
      content: changedNote.content,
      id: changedNote.id as string,
      ownerEmail: changedNote.ownerEmail,
      ownerId: changedNote.ownerId as string,
    };

    const response = await useCase.perform(updateNoteRequest);

    const error = response.value as Error;

    expect(error).toBeInstanceOf(InvalidTitleError);
  });
});
