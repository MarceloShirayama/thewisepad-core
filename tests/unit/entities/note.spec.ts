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

    const error1 = Note.create(validOwner, invalidTitle1, validContent)
    const error2 = Note.create(validOwner, invalidTitle2, validContent)
    const error3 = Note.create(validOwner, invalidTitle3, validContent)

    expect(error1).toEqual(left(new InvalidTitleError()))
    expect(error2).toEqual(left(new InvalidTitleError()))
    expect(error3).toEqual(left(new InvalidTitleError()))
  })
})
