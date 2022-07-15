import { NoteData } from '@/use-cases/ports/note-data'
import { NoteRepository } from '@/use-cases/ports/note-repository'
import { UserRepository } from '@/use-cases/ports/user-repository'
import { UpdateNote } from '@/use-cases/update-note/update-note'
import { InMemoryNoteRepository } from '../repositories/in-memory-note-repository'
import { InMemoryUserRepository } from '../repositories/in-memory-user-repository'

describe('Update note use case', () => {
  const validUserEmail = 'valid@mail.com'
  const validUserPassword = 'valid_password_1'
  const validUserId = '0'
  const originalTitle = 'Original title'
  const newTitle = 'New title'
  const originalContent = 'Original content'
  const newContent = 'New content'
  const noteId = '0'

  const originalNote = {
    id: noteId,
    title: originalTitle,
    content: originalContent,
    ownerId: validUserId,
    ownerEmail: validUserEmail
  } as NoteData

  const newNote = {
    title: newTitle,
    content: newContent,
    ownerId: validUserId,
    ownerEmail: validUserEmail
  } as NoteData

  const noteRepositoryWithNote: NoteRepository = new InMemoryNoteRepository([
    originalNote
  ])

  const userRepositoryWithUser: UserRepository = new InMemoryUserRepository([
    {
      id: validUserId,
      email: validUserEmail,
      password: validUserPassword
    }
  ])

  it('Should update title and content if exists note', async () => {
    const useCase = new UpdateNote(
      noteRepositoryWithNote,
      userRepositoryWithUser
    )

    const result = await useCase.perform(noteId, newNote)
    const { title, content } = result.value as NoteData

    expect(result.value as NoteData).toEqual(newNote)
    expect(title).toBe(newTitle)
    expect(content).toBe(newContent)
  })
})
