import { MongoHelper } from "src/external/repositories/mongodb/helpers";
import { MongodbNoteRepository } from "src/external/repositories/mongodb/mongodb-note-repository";
import { NoteBuilder } from "test/builders/note-builder";

describe("Mongodb user repository", () => {
  beforeAll(async () => await MongoHelper.connect());

  afterAll(async () => await MongoHelper.disconnect());

  beforeEach(async () => await MongoHelper.clearCollection("notes"));

  it("Should add valid note", async () => {
    const repository = new MongodbNoteRepository();

    const validNote = NoteBuilder.createNote().build();

    const addedNote = await repository.add(validNote);

    const noteId = addedNote.id as string;

    const foundNote = await repository.findById(noteId);

    expect(foundNote).toBeTruthy();
  });
});
