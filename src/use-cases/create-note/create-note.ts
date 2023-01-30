import { Note, User } from "../../entities";
import { InvalidTitleError } from "../../entities/errors";
import { Either, left, right } from "../../shared";
import {
  NoteData,
  NoteRepository,
  UseCase,
  UserRepository,
} from "../../use-cases/ports";
import { ExistingTitleError, UnregisteredOwnerError } from "./errors";

export class CreateNote implements UseCase {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository
  ) {}

  async perform(
    request: NoteData
  ): Promise<
    Either<
      UnregisteredOwnerError | InvalidTitleError | ExistingTitleError,
      NoteData
    >
  > {
    const owner = await this.userRepository.findByEmail(request.ownerEmail);

    if (!owner) return left(new UnregisteredOwnerError(request.ownerEmail));

    const { id, email, password } = owner;

    const user = User.create({ email, password }).value as User;

    const noteOrError = Note.create(user, request.title, request.content);

    if (noteOrError.isLeft()) return left(noteOrError.value);

    const ownerNotes = await this.noteRepository.findAllNotesFrom(
      owner.id as string
    );

    const alreadyExistsTitle = ownerNotes.find(
      (note) => note.title === request.title
    );

    if (alreadyExistsTitle) return left(new ExistingTitleError());

    const saveNote = await this.noteRepository.add({
      title: noteOrError.value.title.value,
      content: noteOrError.value.content,
      ownerEmail: owner.email,
      ownerId: id,
    });

    return right(saveNote);
  }
}
