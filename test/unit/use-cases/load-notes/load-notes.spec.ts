import { randomUUID } from "node:crypto";

import { LoadNotes } from "src/use-cases/load-notes";
import { NoteData } from "src/use-cases/ports";
import { NoteBuilder } from "test/builders/note-builder";
import { InMemoryNoteRepository } from "test/doubles/repositories";

describe("Load notes for user use case", () => {
  function makeSut() {
    const note1: NoteData = NoteBuilder.createNote().build();

    const note2: NoteData = NoteBuilder.createNote()
      .withDifferentTitleAndId()
      .build();

    const noteRepositoryWithTwoNotes = new InMemoryNoteRepository([
      note1,
      note2,
    ]);

    const useCase = new LoadNotes(noteRepositoryWithTwoNotes);

    return { useCase, note1, note2 };
  }

  test("Should correctly load notes for a registered user", async () => {
    const { useCase, note1, note2 } = makeSut();

    const notes = await useCase.perform(note1.ownerId as string);

    expect(notes.length).toEqual(2);
    expect(notes[0]).toEqual(note1);
    expect(notes[1]).toEqual(note2);
  });

  test("should fail to load notes for user without notes", async () => {
    const { useCase } = makeSut();

    const notes = await useCase.perform(randomUUID());

    expect(notes.length).toBe(0);
  });
});
