import { Note } from '@/entities/note'
import { User } from '@/entities/user'

describe('Note entity', () => {
  it('Should be created with a valid title and owner', () => {
    const validTitle = 'my note'
    const validEmail = 'my@mail.com'

    const validOwner: User = User.create({ email: validEmail }).value as User

    const note: Note = Note.create(validTitle, validOwner).value as Note

    expect(note.title.value).toBe(validTitle)
    expect(note.owner.email.value).toBe(validEmail)
  })
})
