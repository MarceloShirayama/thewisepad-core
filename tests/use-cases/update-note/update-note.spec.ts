import { NoteData } from "@/use-cases/ports";
import { UpdateNote } from "@/use-cases/update-note";
import { randomUUID } from "node:crypto";
import {
  InMemoryNoteRepository,
  InMemoryUserRepository,
} from "tests/doubles/repositories";
import { describe, expect, test } from "vitest";

describe("Update note use case", () => {
  const originalTitle = "my note";
  const changedTitle = "my changed note";

  const originalContent = "original content";
  const changedContent = "changed content";

  const validUserEmail = "any@mail.com";
  const validUserPassword = "1valid_password";
  const validUserId = randomUUID();

  const noteId = randomUUID();

  const originalNote: NoteData = {
    title: originalTitle,
    content: originalContent,
    ownerEmail: validUserEmail,
    ownerId: validUserId,
    id: noteId,
  };

  const changedNote: NoteData = {
    title: changedTitle,
    content: changedContent,
    ownerEmail: validUserEmail,
  };

  const noteRepositoryWithANote = new InMemoryNoteRepository([originalNote]);
  const userRepositoryWithAUser = new InMemoryUserRepository([
    {
      email: validUserEmail,
      password: validUserPassword,
      id: validUserId,
    },
  ]);

  test("Should update title and content of existing note", async () => {
    const useCase = new UpdateNote(
      noteRepositoryWithANote,
      userRepositoryWithAUser
    );

    const response = await useCase.perform(noteId, changedNote);

    const responseData = response.value as NoteData;

    expect(responseData.title).toBe(changedTitle);
    expect(responseData.content).toBe(changedContent);
  });
});
