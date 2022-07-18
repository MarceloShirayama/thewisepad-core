import { Note, User } from '@/entities'
import { InvalidTitleError } from '@/entities/errors'
import { Either, left, right } from '@/shared'
import { ExistingTitleError } from '@/use-cases/create-note/errors'
import {
  NoteData,
  NoteRepository,
  UseCase,
  UserRepository
} from '@/use-cases/ports'

export class UpdateNote implements UseCase {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async perform(
    changedNoteData: NoteData
  ): Promise<Either<ExistingTitleError | InvalidTitleError, NoteData>> {
    const userData = await this.userRepository.findByEmail(
      changedNoteData.ownerEmail
    )

    const owner = User.create(userData.email, userData.password).value as User

    const noteOrError = Note.create(
      owner,
      changedNoteData.title,
      changedNoteData.content
    )

    if (noteOrError.isLeft()) {
      return left(noteOrError.value)
    }

    const changedNote = noteOrError.value as Note

    const notesFromUser = await this.noteRepository.findAllFromUserId(
      changedNoteData.ownerId as string
    )

    const found = notesFromUser.find(
      (note) => note.title === changedNote.title.value
    )

    if (found) {
      return left(new ExistingTitleError())
    }

    if (changedNoteData.title) {
      await this.noteRepository.updateTitle(
        changedNoteData.id as string,
        changedNoteData.title
      )
    }

    if (changedNoteData.content) {
      await this.noteRepository.updateContent(
        changedNoteData.id as string,
        changedNoteData.content
      )
    }

    return right(changedNoteData)
  }
}
