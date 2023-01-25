import { Note } from "@/entities/note";
import { NoteData } from "@/entities/note-data";
import { UserRepository } from "@/use-cases/ports/user-repository";
import { NoteRepository } from "@/use-cases/ports/note-repository";
import { User } from "@/entities/user";

export class CreateNote {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository
  ) {}

  async perform(request: NoteData): Promise<NoteData> {
    if (!request.ownerEmail) throw new Error("Owner email is required.");

    const owner = await this.userRepository.findUserByEmail(request.ownerEmail);

    if (!owner || !owner.id) throw new Error("Owner not found");

    const user = User.create({
      email: owner.email,
      password: owner.password,
    }).value as User;

    const note = Note.create(user, request.title, request.content)
      .value as Note;

    const saveNote = await this.noteRepository.addNote({
      title: note.title.value,
      content: note.content,
      ownerId: owner.id,
    });

    return saveNote;
  }
}
