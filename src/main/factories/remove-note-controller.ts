import { RemoveNoteController } from "../../presentation/controllers";
import { RemoveNote } from "../../use-cases/remove-note";
import { makeNoteRepository } from "./note-repository";

export function makeRemoveNoteController() {
  const noteRepository = makeNoteRepository();

  const useCase = new RemoveNote(noteRepository);

  const controller = new RemoveNoteController(useCase);

  return controller;
}
