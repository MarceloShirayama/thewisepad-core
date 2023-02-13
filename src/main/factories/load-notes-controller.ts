import { makeNoteRepository } from ".";
import { LoadNotesController } from "../../presentation/controllers";
import { LoadNotes } from "../../use-cases/load-notes";

export function makeLoadNotesController() {
  const noteRepository = makeNoteRepository();
  const useCase = new LoadNotes(noteRepository);
  const controller = new LoadNotesController(useCase);

  return controller;
}
