import { UpdateNoteController } from "../../presentation/controllers";
import { UpdateNote } from "../../use-cases/update-note";
import { makeNoteRepository } from "./note-repository";
import { makeUserRepository } from "./user-repository";

export function makeUpdateNoteController() {
  const userRepository = makeUserRepository();
  const noteRepository = makeNoteRepository();
  const useCase = new UpdateNote(noteRepository, userRepository);
  const controller = new UpdateNoteController(useCase);

  return controller;
}
