import { describe, expect, test } from "vitest";

import { UserData } from "@/entities/user-data";
import { InMemoryNoteRepository } from "./in-memory-note-repository";
import { InMemoryUserRepository } from "../in-memory-user-repository";
import { CreateNote } from "@/use-cases/create-note/create-note";
import { NoteData } from "@/entities/note-data";

describe("Create note use case", () => {
  const validEmail = "any@mail.com";
  const unregisteredEmail = "other@mail.com";
  const validPassword = "1valid_password";
  const validTitle = "my note";
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

    const validCreateNoteRequest: NoteData = {
      title: validTitle,
      content: emptyContent,
      ownerEmail: user.email,
    };
    const emptyNoteRepository = new InMemoryNoteRepository([]);

    const createNoteUseCase = new CreateNote(
      emptyNoteRepository,
      singleUserUserRepository
    );

    return {
      createNoteUseCase,
      validCreateNoteRequest,
      emptyNoteRepository,
      user,
    };
  };

  test("Should create note with valid user and title", async () => {
    const {
      createNoteUseCase,
      validCreateNoteRequest,
      emptyNoteRepository,
      user,
    } = await makeSut();

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
});
