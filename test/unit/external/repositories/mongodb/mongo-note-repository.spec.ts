import { MongoHelper } from "src/external/repositories/mongodb/helpers";
import { MongodbNoteRepository } from "src/external/repositories/mongodb";
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

  it("Should find all notes from an user", async () => {
    const repository = new MongodbNoteRepository();

    const validNote1 = NoteBuilder.createNote().build();
    const validNote2 = NoteBuilder.createNote()
      .withDifferentTitleAndId()
      .build();

    await repository.add(validNote1);
    await repository.add(validNote2);

    const userId = validNote1.ownerId as string;

    const foundNotes = await repository.findAllNotesFrom(userId);

    expect(foundNotes.length).toBe(2);
    expect(foundNotes[0].title).toBe(validNote1.title);
    expect(foundNotes[1].title).toBe(validNote2.title);
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
