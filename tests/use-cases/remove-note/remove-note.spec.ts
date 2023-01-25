import { randomUUID } from "node:crypto";
import { describe, expect, test } from "vitest";

import { NoteData } from "@/use-cases/ports";
import { RemoveNote } from "@/use-cases/remove-note";
import { InMemoryNoteRepository } from "../create-note/in-memory-note-repository";

describe("Remove note use case", () => {
  const validTitle1 = "my note";
  const validUserId = randomUUID();
  const someContent = "some content";
  const note: NoteData = {
    title: validTitle1,
    content: someContent,
    ownerId: validUserId,
    id: randomUUID(),
  };

  const noteRepositoryWithNote = new InMemoryNoteRepository([note]);

  test("Should ", async () => {
    const useCase = new RemoveNote(noteRepositoryWithNote);

    const removedNote = await useCase.perform(note.id as string);

    expect(removedNote).toBe(note);

    const findRemovedNote = await noteRepositoryWithNote.findNote(
      note.id as string
    );

    expect(findRemovedNote).toBeNull();
  });
});
