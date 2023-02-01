import { NoteData, UserData } from "src/use-cases/ports";
import { UpdateNote } from "src/use-cases/update-note";
import { NoteBuilder } from "test/builders/note-builder";
import { UserBuilder } from "test/builders/user-builder";
import {
  InMemoryNoteRepository,
  InMemoryUserRepository,
} from "test/doubles/repositories";

describe("Update note use case", () => {
  function makeSut() {
    const validUser: UserData = UserBuilder.createUser().build();

    const originalNote: NoteData = NoteBuilder.createNote().build();

    const changedNote: NoteData = NoteBuilder.createNote()
      .withDifferentTitleAndContent()
      .build();

    const noteRepositoryWithANote = new InMemoryNoteRepository([originalNote]);

    const userRepositoryWithAUser = new InMemoryUserRepository([validUser]);

    const useCase = new UpdateNote(
      noteRepositoryWithANote,
      userRepositoryWithAUser
    );

    return { useCase, originalNote, changedNote };
  }

  test("Should update title and content of existing note", async () => {
    const { useCase, originalNote, changedNote } = makeSut();

    const response = await useCase.perform(changedNote);

    const responseData = response.value as NoteData;

    expect(responseData.title).toBe(changedNote.title);
    expect(responseData.content).toBe(changedNote.content);
    expect(originalNote.id).toBe(changedNote.id);
  });
});
