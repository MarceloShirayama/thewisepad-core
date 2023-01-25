import { Note } from "@/entities/note";
import { NoteData } from "@/entities/note-data";
import { UserRepository } from "@/use-cases/ports/user-repository";
import { NoteRepository } from "@/use-cases/ports/note-repository";
import { User } from "@/entities/user";
import { Either, left, right } from "@/shared/either";
import { UnregisteredOwnerError } from "./errors/unregistered-owner-error";
import { UserData } from "@/entities/user-data";

export class CreateNote {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository
  ) {}

  async perform(
    request: NoteData
  ): Promise<Either<UnregisteredOwnerError, NoteData>> {
    if (!request.ownerEmail) throw new Error("Owner email is required.");

    const owner = await this.userRepository.findUserByEmail(request.ownerEmail);

    if (!owner) return left(new UnregisteredOwnerError(request.ownerEmail));

    const { id, email, password } = owner;

    const user = User.create({ email, password }).value as User;

    const note = Note.create(user, request.title, request.content)
      .value as Note;

    const saveNote = await this.noteRepository.addNote({
      title: note.title.value,
      content: note.content,
      ownerId: id,
    });

    return right(saveNote);
  }
}
