import { InvalidTitleError } from '@/entities/errors/invalid-title-error'
import { Note } from '@/entities/note'
import { User } from '@/entities/user'
import { left } from '@/shared/either'

describe('Note entity', () => {
  it('Should be created with a valid title and owner', () => {
    const validTitle = 'my note'
    const validEmail = 'my@mail.com'
    const validPassword = 'valid_password_1'
    const validContent = 'my content'

    const validOwner: User = User.create({
      email: validEmail,
      password: validPassword
    }).value as User

    const note: Note = Note.create(validOwner, validTitle, validContent)
      .value as Note

    expect(note.title.value).toBe(validTitle)
    expect(note.owner.email.value).toBe(validEmail)
  })

  it('Should not be created with invalid title', () => {
    const invalidTitle1 = null as any as string
    const invalidTitle2 = ''
    const invalidTitle3 = '12'
    const validEmail = 'my@mail.com'
    const validPassword = 'valid_password_1'
    const validContent = 'my content'

    const validOwner: User = User.create({
      email: validEmail,
      password: validPassword
    }).value as User

    expect(Note.create(validOwner, invalidTitle1, validContent).isLeft()).toBe(
      true
    )
    expect(Note.create(validOwner, invalidTitle1, validContent)).toEqual(
      left(new InvalidTitleError(invalidTitle1))
    )
    expect(Note.create(validOwner, invalidTitle2, validContent).isLeft()).toBe(
      true
    )
    expect(Note.create(validOwner, invalidTitle2, validContent)).toEqual(
      left(new InvalidTitleError(invalidTitle2))
    )
    expect(Note.create(validOwner, invalidTitle3, validContent).isLeft()).toBe(
      true
    )
    expect(Note.create(validOwner, invalidTitle3, validContent)).toEqual(
      left(new InvalidTitleError(invalidTitle3))
    )
  })
})
