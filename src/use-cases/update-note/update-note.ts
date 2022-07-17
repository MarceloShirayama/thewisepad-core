import { Note, User } from '@/entities'
import { InvalidTitleError } from '@/entities/errors'
import { Either, left, right } from '@/shared'
import { ExistingTitleError } from '@/use-cases/create-note/errors'
import { NoteData, NoteRepository, UserRepository } from '@/use-cases/ports'
import { UserNotOwnerError } from '@/use-cases/update-note/errors'

export class UpdateNote {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async perform(
    noteId: string,
    changedNoteData: NoteData
  ): Promise<Either<ExistingTitleError | InvalidTitleError, NoteData>> {
    const { ownerEmail } = await this.noteRepository.findById(noteId)

    if (ownerEmail !== changedNoteData.ownerEmail) {
      return left(new UserNotOwnerError())
    }

    const user = await this.userRepository.findByEmail(ownerEmail)

    const owner = User.create(user.email, user.password).value as User

    // const noteOrError = Note.create(
    //   owner,
    //   changedNoteData.title,
    //   changedNoteData.content
    // )

    // if (noteOrError.isLeft()) {
    //   return left(noteOrError.value)
    // }

    // const changedNote = noteOrError.value as Note
    const changedNote = Note.create(
      owner,
      changedNoteData.title,
      changedNoteData.content
    ).value as Note

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
      await this.noteRepository.updateTitle(noteId, changedNoteData.title)
    }

    if (changedNoteData.content) {
      await this.noteRepository.updateContent(noteId, changedNoteData.content)
    }

    return right(changedNoteData)
  }
}
