import { Note } from '@/entities/note'
import { User } from '@/entities/user'
import { left } from '@/shared/either'

describe('Note entity', () => {
  it('Should be created with a valid title and owner', () => {
    const validTitle = 'my note'
    const validEmail = 'my@mail.com'

    const validOwner: User = User.create({ email: validEmail }).value as User

    const note: Note = Note.create(validTitle, validOwner).value as Note

    expect(note.title.value).toBe(validTitle)
    expect(note.owner.email.value).toBe(validEmail)
  })

  it('Should not be created with invalid title', () => {
    const invalidTitle1 = null as any as string
    const invalidTitle2 = ''
    const invalidTitle3 = '12'
    const validEmail = 'my@mail.com'

    const validOwner: User = User.create({ email: validEmail }).value as User

    expect(Note.create(invalidTitle1, validOwner).isLeft()).toBe(true)
    expect(Note.create(invalidTitle1, validOwner)).toEqual(
      left(new Error(`Invalid title: ${invalidTitle1}`))
    )
    expect(Note.create(invalidTitle2, validOwner).isLeft()).toBe(true)
    expect(Note.create(invalidTitle2, validOwner)).toEqual(
      left(new Error(`Invalid title: ${invalidTitle2}`))
    )
    expect(Note.create(invalidTitle3, validOwner).isLeft()).toBe(true)
    expect(Note.create(invalidTitle3, validOwner)).toEqual(
      left(new Error(`Invalid title: ${invalidTitle3}`))
    )
  })
})
