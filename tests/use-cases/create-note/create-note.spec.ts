import { describe, expect, test } from "vitest";

import { CreateNote } from "@/use-cases/create-note";
import { NoteData, UserData } from "@/use-cases/ports";
import {
  InMemoryNoteRepository,
  InMemoryUserRepository,
} from "tests/doubles/repositories";

describe("Create note use case", () => {
  const validEmail = "any@mail.com";
  const unregisteredEmail = "other@mail.com";
  const validPassword = "1valid_password";
  const validTitle = "my note";
  const invalidTitle = "no";
  const emptyContent = "";

  const validRegisteredUser: UserData = {
    email: validEmail,
    password: validPassword,
  };

  const unregisteredUser: UserData = {
    email: unregisteredEmail,
    password: validPassword,
  };

  const createNoteRequestWithUnregisteredOwner: NoteData = {
    title: validTitle,
    content: emptyContent,
    ownerEmail: unregisteredUser.email,
  };

  const makeSut = async () => {
    const userDataArrayWithSingleUser = [validRegisteredUser];
    const singleUserUserRepository = new InMemoryUserRepository(
      userDataArrayWithSingleUser
    );

    const user = await singleUserUserRepository.addUser(validRegisteredUser);

    const emptyNoteRepository = new InMemoryNoteRepository([]);

    const createNoteUseCase = new CreateNote(
      emptyNoteRepository,
      singleUserUserRepository
    );

    return {
      createNoteUseCase,
      emptyNoteRepository,
      user,
    };
  };

  test("Should create note with valid user and title", async () => {
    const { createNoteUseCase, emptyNoteRepository, user } = await makeSut();

    const validCreateNoteRequest: NoteData = {
      title: validTitle,
      content: emptyContent,
      ownerEmail: user.email,
    };

    const response = (await createNoteUseCase.perform(validCreateNoteRequest))
      .value as NoteData;

    const addedNotes = await emptyNoteRepository.findAllNotesFrom(
      validRegisteredUser.id as string
    );

    expect(addedNotes.length).toBe(1);
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("content", "");
    expect(response).toHaveProperty("title", validTitle);
    expect(response.ownerId).toBe(user.id);
  });

  test("Should not create note with unregistered owner", async () => {
    const { createNoteUseCase } = await makeSut();

    const error = (
      await createNoteUseCase.perform(createNoteRequestWithUnregisteredOwner)
    ).value as Error;

    expect(error.name).toBe("UnregisteredOwnerError");
  });

  test("Should not create note with invalid title", async () => {
    const { createNoteUseCase, user } = await makeSut();

    const validCreateNoteRequest: NoteData = {
      title: invalidTitle,
      content: emptyContent,
      ownerEmail: user.email,
    };

    const error = (await createNoteUseCase.perform(validCreateNoteRequest))
      .value as Error;

    expect(error.name).toBe("InvalidTitleError");
  });

  test("Should not create note with existing title", async () => {
    const { createNoteUseCase, user } = await makeSut();

    const validCreateNoteRequest: NoteData = {
      title: validTitle,
      content: emptyContent,
      ownerEmail: user.email,
    };

    await createNoteUseCase.perform(validCreateNoteRequest);

    const error = (await createNoteUseCase.perform(validCreateNoteRequest))
      .value as Error;

    expect(error.name).toBe("ExistingTitleError");
    expect(error.message).toBe("User already has note with the same title.");
  });
});
