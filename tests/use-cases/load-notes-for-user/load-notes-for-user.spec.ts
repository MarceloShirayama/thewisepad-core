import { randomUUID } from "node:crypto";

import { NoteData } from "@/entities/note-data";
import { LoadNotesForUser } from "@/use-cases/load-notes-for-user/load-notes-for-user";
import { describe, expect, test } from "vitest";
import { InMemoryNoteRepository } from "../create-note/in-memory-note-repository";

describe("Load notes for user use case", () => {
  const validTitle1 = "my note";
  const validTitle2 = "my second note";
  const validUserId = randomUUID();
  const someContent = "some content";
  const someOtherContent = "some other content";
  const note1: NoteData = {
    title: validTitle1,
    content: someContent,
    ownerId: validUserId,
    id: randomUUID(),
  };
  const note2: NoteData = {
    title: validTitle2,
    content: someOtherContent,
    ownerId: validUserId,
    id: randomUUID(),
  };

  const noteRepositoryWithTwoNotes = new InMemoryNoteRepository([note1, note2]);

  test("Should correctly load notes for a registered user", async () => {
    const loadNotesForUserUseCase = new LoadNotesForUser(
      noteRepositoryWithTwoNotes
    );

    const notes = await loadNotesForUserUseCase.perform(validUserId);

    expect(notes.length).toEqual(2);
    expect(notes[0]).toEqual(note1);
    expect(notes[1]).toEqual(note2);
  });
});
