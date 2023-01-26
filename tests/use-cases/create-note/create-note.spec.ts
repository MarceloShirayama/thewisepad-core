import { describe, expect, test } from "vitest";

import { CreateNote } from "@/use-cases/create-note";
import { NoteData, UserData } from "@/use-cases/ports";
import { NoteBuilder } from "tests/doubles/builders/note-builder";
import { UserBuilder } from "tests/doubles/builders/user-builder";
import {
  InMemoryNoteRepository,
  InMemoryUserRepository,
} from "tests/doubles/repositories";

describe("Create note use case", () => {
  const createValidNoteRequest: NoteData = NoteBuilder.createNote().build();

  const validRegisteredUser: UserData = UserBuilder.createUser().build();

  const createNoteRequestWithUnregisteredOwner: NoteData =
    NoteBuilder.createNote().build();
  const unregisteredEmail = UserBuilder.createUser()
    .withUnregisteredUser()
    .build().email;
  createNoteRequestWithUnregisteredOwner.ownerEmail = unregisteredEmail;

  const makeSut = async () => {
    const userDataArrayWithSingleUser = [validRegisteredUser];
    const singleUserUserRepository = new InMemoryUserRepository(
      userDataArrayWithSingleUser
    );

    const emptyNoteRepository = new InMemoryNoteRepository([]);

    const createNoteUseCase = new CreateNote(
      emptyNoteRepository,
      singleUserUserRepository
    );

    return {
      createNoteUseCase,
      emptyNoteRepository,
    };
  };

  test("Should create note with valid user and title", async () => {
    const { createNoteUseCase, emptyNoteRepository } = await makeSut();
    const response = (await createNoteUseCase.perform(createValidNoteRequest))
      .value as NoteData;

    const addedNotes = await emptyNoteRepository.findAllNotesFrom(
      validRegisteredUser.id as string
    );

    expect(addedNotes.length).toBe(1);
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("content", createValidNoteRequest.content);
    expect(response).toHaveProperty("title", createValidNoteRequest.title);
    expect(response.ownerId).toBeDefined();
    expect(response.id).toBeDefined();
  });

  test("Should not create note with unregistered owner", async () => {
    const { createNoteUseCase } = await makeSut();

    const error = (
      await createNoteUseCase.perform(createNoteRequestWithUnregisteredOwner)
    ).value as Error;

    expect(error.name).toBe("UnregisteredOwnerError");
  });

  test("Should not create note with invalid title", async () => {
    const { createNoteUseCase } = await makeSut();

    const validCreateNoteRequest: NoteData = NoteBuilder.createNote()
      .withTitleWithExcessChars()
      .build();

    const error = (await createNoteUseCase.perform(validCreateNoteRequest))
      .value as Error;

    expect(error.name).toBe("InvalidTitleError");
  });

  test("Should not create note with existing title", async () => {
    const { createNoteUseCase } = await makeSut();

    await createNoteUseCase.perform(createValidNoteRequest);

    const error = (await createNoteUseCase.perform(createValidNoteRequest))
      .value as Error;

    expect(error.name).toBe("ExistingTitleError");
    expect(error.message).toBe("User already has note with the same title.");
  });
});
