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

  test("Should update title and content of existing note", async () => {
    const { useCase, originalNote, changedNote } = makeSut();

    const response = await useCase.perform(
      originalNote.id as string,
      changedNote
    );

    const responseData = response.value as NoteData;

    expect(responseData.title).toBe(changedNote.title);
    expect(responseData.content).toBe(changedNote.content);
  });
});
