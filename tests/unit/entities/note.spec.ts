import { Note, User } from '@/entities'
import { InvalidTitleError } from '@/entities/errors'
import { left } from '@/shared'
import {
  NoteDataBuilder,
  UserDataBuilder
} from '@/tests/unit/use-cases/builders'

describe('Note entity', () => {
  const validUser = UserDataBuilder.validUser().build()

  const validOwner: User = User.create(validUser.email, validUser.password)
    .value as User

  const validNote = NoteDataBuilder.validNote().build()

  it('Should be created with a valid title and owner', () => {
    const note: Note = Note.create(
      validOwner,
      validNote.title,
      validNote.content
    ).value as Note

    expect(note.title.value).toBe(validNote.title)
    expect(note.owner.email.value).toBe(validOwner.email.value)
  })

  it('Should not be able created a new note if title too short', () => {
    const noteWithTitleTooShort = JSON.parse(JSON.stringify(validNote))
    noteWithTitleTooShort.title = 'a'

    const error = Note.create(
      validOwner,
      noteWithTitleTooShort.title,
      noteWithTitleTooShort.content
    )

    expect(error).toEqual(left(new InvalidTitleError()))
  })

  it('Should not be able created a new note if title too long', () => {
    const noteWithTitleTooLong = JSON.parse(JSON.stringify(validNote))
    noteWithTitleTooLong.title = 'a'.repeat(257)

    const error = Note.create(
      validOwner,
      noteWithTitleTooLong.title,
      noteWithTitleTooLong.content
    )

    expect(error).toEqual(left(new InvalidTitleError()))
  })
})
