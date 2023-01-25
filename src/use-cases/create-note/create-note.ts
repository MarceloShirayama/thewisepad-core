import { InvalidTitleError } from "@/entities/errors/invalid-title-error";
import { Note } from "@/entities/note";
import { NoteData } from "@/entities/note-data";
import { User } from "@/entities/user";
import { Either, left, right } from "@/shared/either";
import { ReplaceType } from "@/shared/replace-type";
import { NoteRepository } from "@/use-cases/ports/note-repository";
import { UserRepository } from "@/use-cases/ports/user-repository";
import { UnregisteredOwnerError } from "./errors/unregistered-owner-error";

export class CreateNote {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository
  ) {}

  async perform(
    request: ReplaceType<NoteData, { ownerEmail: string }>
  ): Promise<Either<UnregisteredOwnerError | InvalidTitleError, NoteData>> {
    const owner = await this.userRepository.findUserByEmail(request.ownerEmail);

    if (!owner) return left(new UnregisteredOwnerError(request.ownerEmail));

    const { id, email, password } = owner;

    const user = User.create({ email, password }).value as User;

    const noteOrError = Note.create(user, request.title, request.content);

    if (noteOrError.isLeft()) return left(noteOrError.value);

    const saveNote = await this.noteRepository.addNote({
      title: noteOrError.value.title.value,
      content: noteOrError.value.content,
      ownerId: id,
    });

    return right(saveNote);
  }
}
