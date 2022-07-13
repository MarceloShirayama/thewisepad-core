import { Note } from '@/entities/note'
import { User } from '@/entities/user'
import { UserRepository } from '../ports/user-repository'
import { NoteData } from './note-data'
import { NoteRepository } from './ports/note-repository'

export class CreateNote {
  private readonly _noteRepository: NoteRepository
  private readonly _userRepository: UserRepository

  constructor(noteRepository: NoteRepository, userRepository: UserRepository) {
    this._noteRepository = noteRepository
    this._userRepository = userRepository
  }

  private get noteRepository() {
    return this._noteRepository
  }

  private get userRepository() {
    return this._userRepository
  }

  public async perform(request: NoteData): Promise<NoteData> {
    const owner = await this.userRepository.findUserByEmail(
      request.ownerEmail as string
    )

    const note = Note.create(
      User.create(owner).value as User,
      request.title,
      request.content
    ).value as Note

    return this.noteRepository.addNote({
      title: note.title.value,
      content: note.content,
      ownerId: owner.id
    })
  }
}
