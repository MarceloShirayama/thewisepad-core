import { RemoveNoteController } from "src/presentation/controllers/remove-note";
import { RemoveNote } from "src/use-cases/remove-note";
import { NoteBuilder } from "test/builders/note-builder";
import { InMemoryNoteRepository } from "test/doubles/repositories";

describe("Remove note controller", () => {
  it("Should return 200 if successfully removing note", async () => {
    const validNote = NoteBuilder.createNote().build();

    const noteRepositoryWithOneNote = new InMemoryNoteRepository([validNote]);

    const useCase = new RemoveNote(noteRepositoryWithOneNote);

    const controller = new RemoveNoteController(useCase);

    const response = await controller.handle({
      body: { noteId: validNote.id },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(validNote);
  });
});
