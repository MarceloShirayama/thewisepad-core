import { Note, User } from "../../entities";
import { InvalidTitleError } from "../../entities/errors";
import { Either, left, right } from "../../shared";
import {
  NoteData,
  NoteRepository,
  UseCase,
  UserData,
  UserRepository,
} from "../../use-cases/ports";
import { ExistingTitleError } from "../../use-cases/create-note/errors";

export class UpdateNote implements UseCase {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository
  ) {}

  async perform(
    changeNoteData: NoteData
  ): Promise<Either<ExistingTitleError | InvalidTitleError, NoteData>> {
    const userData = await this.userRepository.findByEmail(
      changeNoteData.ownerEmail as string
    );

    const { email, password } = userData as UserData;

    const owner = User.create({ email, password }).value as User;

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

    if (changeNoteData.title) {
      await this.noteRepository.updateTitle(
        changeNoteData.id as string,
        changeNoteData.title
      );
    }

    if (changeNoteData.content) {
      await this.noteRepository.updateContent(
        changeNoteData.id as string,
        changeNoteData.content
      );
    }

    return right(changeNoteData);
  }
}
