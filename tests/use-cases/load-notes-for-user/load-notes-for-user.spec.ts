import { randomUUID } from "node:crypto";
import { describe, expect, test } from "vitest";

import { LoadNotesForUser } from "@/use-cases/load-notes-for-user";
import { NoteData } from "@/use-cases/ports";
import { NoteBuilder } from "tests/doubles/builders/note-builder";
import { InMemoryNoteRepository } from "tests/doubles/repositories";

describe("Load notes for user use case", () => {
  const note1: NoteData = NoteBuilder.createNote().build();

  const note2: NoteData = NoteBuilder.createNote()
    .withDifferentTitleAndId()
    .build();

  const noteRepositoryWithTwoNotes = new InMemoryNoteRepository([note1, note2]);

  test("Should correctly load notes for a registered user", async () => {
    const loadNotesForUserUseCase = new LoadNotesForUser(
      noteRepositoryWithTwoNotes
    );

    const notes = await loadNotesForUserUseCase.perform(
      note1.ownerId as string
    );

    expect(notes.length).toEqual(2);
    expect(notes[0]).toEqual(note1);
    expect(notes[1]).toEqual(note2);
  });

  test("should fail to load notes for user without notes", async () => {
    const loadNotesForUserUseCase = new LoadNotesForUser(
      noteRepositoryWithTwoNotes
    );

    const notes = await loadNotesForUserUseCase.perform(randomUUID());

    expect(notes.length).toBe(0);
  });
});
