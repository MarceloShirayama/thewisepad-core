import { CreateNoteController } from "../../presentation/controllers";
import { CreateNote } from "../../use-cases/create-note";
import { makeNoteRepository, makeUserRepository } from ".";

export function makeCreateNoteController() {
  const noteRepository = makeNoteRepository();

  const userRepository = makeUserRepository();

  const useCase = new CreateNote(noteRepository, userRepository);

  const controller = new CreateNoteController(useCase);

  return controller;
}
