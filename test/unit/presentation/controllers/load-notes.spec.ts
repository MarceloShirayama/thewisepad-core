import { LoadNotesController } from "src/presentation/controllers";
import { LoadNotes } from "src/use-cases/load-notes";
import { NoteBuilder } from "test/builders/note-builder";
import { UserBuilder } from "test/builders/user-builder";
import { InMemoryNoteRepository } from "test/doubles/repositories";

describe("Load notes controller", () => {
  it("Should return 200 when load notes use case returns", async () => {
    const note1 = NoteBuilder.createNote().build();
    const note2 = NoteBuilder.createNote().withDifferentTitleAndId().build();

    const valiUser = UserBuilder.createUser().build();

    const noteRepositoryWithTwoNotes = new InMemoryNoteRepository([
      note1,
      note2,
    ]);

    const useCase = new LoadNotes(noteRepositoryWithTwoNotes);

    const controller = new LoadNotesController(useCase);

    const request = {
      body: { userId: valiUser.id },
    };

    const response = await controller.handle(request);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual(expect.arrayContaining([note1, note2]));
  });
});
