import { Note } from '@/entities/note'
import { User } from '@/entities/user'
import { Either, left, right } from '@/shared/either'
import { UserRepository } from '../ports/user-repository'
import { UnregisteredOwnerError } from './errors/invalid-owner-error'
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

  public async perform(
    request: NoteData
  ): Promise<Either<UnregisteredOwnerError, NoteData>> {
    const owner = await this.userRepository.findUserByEmail(
      request.ownerEmail as string
    )

    if (!owner) {
      return left(new UnregisteredOwnerError())
    }

    const note = Note.create(
      User.create(owner).value as User,
      request.title,
      request.content
    ).value as Note

    const newNote = await this.noteRepository.addNote({
      title: note.title.value,
      content: note.content,
      ownerId: owner.id
    })

    return right(newNote)
  }
}
