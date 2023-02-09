import { MongodbNoteRepository } from "../../external/repositories/mongodb";

export function makeNoteRepository() {
  return new MongodbNoteRepository();
}
