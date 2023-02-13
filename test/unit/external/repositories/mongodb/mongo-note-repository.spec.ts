import { MongoHelper } from "src/external/repositories/mongodb/helpers";
import {
  MongodbNoteRepository,
  MongodbUserRepository,
} from "src/external/repositories/mongodb";
import { NoteBuilder, UserBuilder } from "test/builders";

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

  it("Should find all notes from an user", async () => {
    const userRepository = new MongodbUserRepository();
    const noteRepository = new MongodbNoteRepository();

    const validUser = UserBuilder.createUser().build();

    const user = await userRepository.add(validUser);

    const validNote1 = NoteBuilder.createNote().build();
    const validNote2 = NoteBuilder.createNote()
      .withDifferentTitleAndId()
      .build();

    const userId = user.id as string;
    validNote1.ownerId = userId;
    validNote2.ownerId = userId;

    const note1 = await noteRepository.add(validNote1);
    const note2 = await noteRepository.add(validNote2);

    const foundNotes = await noteRepository.findAllNotesFrom(userId);

    expect(foundNotes.length).toBe(2);
    expect(foundNotes[0].title).toBe(note1.title);
    expect(foundNotes[1].title).toBe(note2.title);
  });

  it("Should remove existing note", async () => {
    const repository = new MongodbNoteRepository();

    const validNote = NoteBuilder.createNote().build();

    const addedNote = await repository.add(validNote);

    const noteId = addedNote.id as string;

    const foundNote = await repository.findById(noteId);

    expect(foundNote).toBeTruthy();

    await repository.remove(noteId);

    const removedNote = await repository.findById(noteId);

    expect(removedNote).toBeNull();
  });

  it("Should not remove non-existent note", async () => {
    const repository = new MongodbNoteRepository();

    const idNonExistentNote = "6058fdd8dcaa1ab0d608f337";

    const response = await repository.remove(idNonExistentNote);

    expect(response).toBeNull();
  });

  it("Should update title of existing note", async () => {
    const repository = new MongodbNoteRepository();

    const validNote = NoteBuilder.createNote().build();

    const addedNote = await repository.add(validNote);

    const noteId = addedNote.id as string;

    const newTitle = "New title";

    const result = await repository.updateTitle(noteId, newTitle);

    expect(result).toBeTruthy();

    const updatedNote = await repository.findById(noteId);

    expect(updatedNote?.title).toBe(newTitle);
  });

  it("Should update content of existing note", async () => {
    const repository = new MongodbNoteRepository();

    const validNote = NoteBuilder.createNote().build();

    const addedNote = await repository.add(validNote);

    const noteId = addedNote.id as string;

    const newContent = "New content";

    const result = await repository.updateContent(noteId, newContent);

    expect(result).toBeTruthy();

    const updatedNote = await repository.findById(noteId);

    expect(updatedNote?.content).toBe(newContent);
  });
});
