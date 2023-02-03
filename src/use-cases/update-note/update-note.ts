import { Note, User } from "../../entities";
import { InvalidTitleError } from "../../entities/errors";
import { Either, left, right } from "../../shared";
import { ExistingTitleError } from "../../use-cases/create-note/errors";
import {
  NoteData,
  NoteRepository,
  UseCase,
  UserData,
  UserRepository,
} from "../../use-cases/ports";

export type UpdateNoteRequest = {
  title?: string;
  content?: string;
  ownerEmail: string;
  ownerId: string;
  id: string;
};

export class UpdateNote implements UseCase {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository
  ) {}

  async perform(
    changeNoteData: UpdateNoteRequest
  ): Promise<Either<ExistingTitleError | InvalidTitleError, NoteData>> {
    const userData = await this.userRepository.findByEmail(
      changeNoteData.ownerEmail
    );

    const originalNoteData = await this.noteRepository.findById(
      changeNoteData.id
    );

    const { email, password } = userData as UserData;

    const owner = User.create({ email, password }).value as User;

    const noteOrError = Note.create(
      owner,
      changeNoteData.title
        ? (changeNoteData.title as string)
        : (originalNoteData?.title as string),
      changeNoteData.content
        ? (changeNoteData.content as string)
        : (originalNoteData?.content as string)
    );

    if (noteOrError.isLeft()) return left(noteOrError.value);

    const changedNote = noteOrError.value;

    if (changeNoteData.title) {
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
    }

    if (changeNoteData.content) {
      await this.noteRepository.updateContent(
        changeNoteData.id as string,
        changeNoteData.content
      );
    }

    const notesFromOwner = (await this.noteRepository.findById(
      changeNoteData.id
    )) as NoteData;

    return right(notesFromOwner);
  }
}
