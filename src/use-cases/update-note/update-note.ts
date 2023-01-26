import { Note, User } from "@/entities";
import { InvalidTitleError } from "@/entities/errors";
import { Either, left, right } from "@/shared";
import {
  NoteData,
  NoteRepository,
  UserData,
  UserRepository,
} from "@/use-cases/ports";
import { ExistingTitleError } from "@/use-cases/create-note/errors";

export class UpdateNote {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository
  ) {}

  async perform(
    noteId: string,
    changeNoteData: NoteData
  ): Promise<Either<ExistingTitleError | InvalidTitleError, NoteData>> {
    const user = (await this.userRepository.findByEmail(
      changeNoteData.ownerEmail as string
    )) as UserData;

    const owner = User.create(user).value as User;

    const noteOrError = Note.create(
      owner,
      changeNoteData.title,
      changeNoteData.content
    );

    if (noteOrError.isLeft()) return left(noteOrError.value);

    const changedNote = noteOrError.value;

    const notesFromUser = await this.noteRepository.findAllNotesFrom(
      changeNoteData.ownerId as string
    );

    const foundNoteWithSameTitle = notesFromUser.find(
      (note) => note.title === changedNote.title.value
    );

    if (foundNoteWithSameTitle) return left(new ExistingTitleError());

    if (changeNoteData.content) {
      await this.noteRepository.updateContent(noteId, changeNoteData.content);
    }

    return right(changeNoteData);
  }
}
