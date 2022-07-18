import { Note, User } from '@/entities'
import { InvalidTitleError } from '@/entities/errors'
import { Either, left, right } from '@/shared/either'
import {
  ExistingTitleError,
  UnregisteredOwnerError
} from '@/use-cases/create-note/errors'
import {
  NoteData,
  NoteRepository,
  UseCase,
  UserRepository
} from '@/use-cases/ports'

export class CreateNote implements UseCase {
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
  ): Promise<
    Either<
      UnregisteredOwnerError | ExistingTitleError | InvalidTitleError,
      NoteData
    >
  > {
    const owner = await this.userRepository.findByEmail(
      request.ownerEmail as string
    )

    if (!owner) {
      return left(new UnregisteredOwnerError())
    }

    const ownerUser = User.create(owner.email, owner.password).value as User

    const noteOrError = Note.create(ownerUser, request.title, request.content)

    if (noteOrError.isLeft()) {
      return left(noteOrError.value)
    }

    const ownerNotes: NoteData[] = await this.noteRepository.findAllFromUserId(
      owner.id as string
    )

    const existingTitle = ownerNotes.find(
      (note) => note.title === request.title
    )

    if (existingTitle) {
      return left(new ExistingTitleError())
    }

    const note: Note = noteOrError.value

    const newNote = await this.noteRepository.add({
      title: note.title.value,
      content: note.content,
      ownerEmail: ownerUser.email.value,
      ownerId: owner.id
    })

    return right(newNote)
  }
}
