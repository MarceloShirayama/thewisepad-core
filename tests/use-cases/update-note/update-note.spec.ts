import { NoteData, UserData } from "@/use-cases/ports";
import { UpdateNote } from "@/use-cases/update-note";
import { randomUUID } from "node:crypto";
import { NoteBuilder } from "tests/doubles/builders/note-builder";
import { UserBuilder } from "tests/doubles/builders/user-builder";
import {
  InMemoryNoteRepository,
  InMemoryUserRepository,
} from "tests/doubles/repositories";
import { describe, expect, test } from "vitest";

describe("Update note use case", () => {
  const validUser: UserData = UserBuilder.createUser().build();

  const noteId = randomUUID();

  const originalNote: NoteData = NoteBuilder.createNote().build();

  const changedNote: NoteData = NoteBuilder.createNote()
    .withDifferentTitleAndContent()
    .build();

  const noteRepositoryWithANote = new InMemoryNoteRepository([originalNote]);

  const userRepositoryWithAUser = new InMemoryUserRepository([
    {
      email: validUser.email,
      password: validUser.password,
      id: validUser.id,
    },
  ]);

  test("Should update title and content of existing note", async () => {
    const useCase = new UpdateNote(
      noteRepositoryWithANote,
      userRepositoryWithAUser
    );

    const response = await useCase.perform(noteId, changedNote);

    const responseData = response.value as NoteData;

    expect(responseData.title).toBe(changedNote.title);
    expect(responseData.content).toBe(changedNote.content);
  });
});
