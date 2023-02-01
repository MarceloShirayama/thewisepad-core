import { describe, expect, test } from "vitest";

import { CreateNote } from "src/use-cases/create-note";
import { NoteData, UserData } from "src/use-cases/ports";
import { NoteBuilder } from "test/builders/note-builder";
import { UserBuilder } from "test/builders/user-builder";
import {
  InMemoryNoteRepository,
  InMemoryUserRepository,
} from "test/doubles/repositories";

describe("Create note use case", () => {
  const makeSut = async () => {
    const validNote: NoteData = NoteBuilder.createNote().build();
    const validUser: UserData = UserBuilder.createUser().build();

    const noteWithUnregisteredOwner: NoteData = NoteBuilder.createNote()
      .withUnregisteredOwner()
      .build();

    const userDataArrayWithSingleUser = [validUser];

    const singleUserUserRepository = new InMemoryUserRepository(
      userDataArrayWithSingleUser
    );

    const emptyNoteRepository = new InMemoryNoteRepository([]);

    const useCase = new CreateNote(
      emptyNoteRepository,
      singleUserUserRepository
    );

    return {
      useCase,
      emptyNoteRepository,
      validNote,
      validUser,
      noteWithUnregisteredOwner,
    };
  };

  test("Should create note with valid user and title", async () => {
    const { useCase, emptyNoteRepository, validNote, validUser } =
      await makeSut();
    const response = (await useCase.perform(validNote)).value as NoteData;

    const addedNotes = await emptyNoteRepository.findAllNotesFrom(
      validUser.id as string
    );

    expect(addedNotes.length).toBe(1);
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("content", validNote.content);
    expect(response).toHaveProperty("title", validNote.title);
    expect(response.ownerId).toBeDefined();
    expect(response.id).toBeDefined();
  });

  test("Should not create note with unregistered owner", async () => {
    const { useCase, noteWithUnregisteredOwner } = await makeSut();

    const error = (await useCase.perform(noteWithUnregisteredOwner))
      .value as Error;

    expect(error.name).toBe("UnregisteredOwnerError");
  });

  test("Should not create note with invalid title", async () => {
    const { useCase } = await makeSut();

    const validCreateNoteRequest: NoteData = NoteBuilder.createNote()
      .withTitleWithExcessChars()
      .build();

    const error = (await useCase.perform(validCreateNoteRequest))
      .value as Error;

    expect(error.name).toBe("InvalidTitleError");
  });

  test("Should not create note with existing title", async () => {
    const { useCase, validNote } = await makeSut();

    await useCase.perform(validNote);

    const error = (await useCase.perform(validNote)).value as Error;

    expect(error.name).toBe("ExistingTitleError");
    expect(error.message).toBe("User already has note with the same title.");
  });
});
