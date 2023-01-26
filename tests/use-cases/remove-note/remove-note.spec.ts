import { randomUUID } from "node:crypto";
import { describe, expect, test } from "vitest";

import { NoteData } from "@/use-cases/ports";
import { RemoveNote } from "@/use-cases/remove-note";
import { InMemoryNoteRepository } from "tests/doubles/repositories";
import { NoteBuilder } from "tests/doubles/builders/note-builder";

describe("Remove note use case", () => {
  const note: NoteData = NoteBuilder.createNote().build();

  const noteRepositoryWithNote = new InMemoryNoteRepository([note]);

  test("Should ", async () => {
    const useCase = new RemoveNote(noteRepositoryWithNote);

    const removedNote = await useCase.perform(note.id as string);

    expect(removedNote).toBe(note);

    const findRemovedNote = await noteRepositoryWithNote.findById(
      note.id as string
    );

    expect(findRemovedNote).toBeNull();
  });
});
