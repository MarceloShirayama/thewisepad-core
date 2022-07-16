import { left } from '@/shared/either'
import { ExistingTitleError } from '@/use-cases/create-note/errors/existing-title-error'
import { NoteData } from '@/use-cases/ports/note-data'
import { NoteRepository } from '@/use-cases/ports/note-repository'
import { UserRepository } from '@/use-cases/ports/user-repository'
import { UserNotOwnerError } from '@/use-cases/update-note/errors/user-not-owner'
import { UpdateNote } from '@/use-cases/update-note/update-note'
import { NoteDataBuilder } from '../builders/note-builder'
import { UserDataBuilder } from '../builders/user-builder'
import { InMemoryNoteRepository } from '../repositories/in-memory-note-repository'
import { InMemoryUserRepository } from '../repositories/in-memory-user-repository'

describe('Update note use case', () => {
  const originalNote = NoteDataBuilder.validNote().build()

  const newNote = NoteDataBuilder.validNote().withDifferentTileAndId().build()

  const noteRepositoryWithNote: NoteRepository = new InMemoryNoteRepository([
    originalNote
  ])

  const userRepositoryWithUser: UserRepository = new InMemoryUserRepository([
    UserDataBuilder.validUser().build()
  ])

  it(`Should be able update title and content if exists note for note owner
    `, async () => {
    const useCase = new UpdateNote(
      noteRepositoryWithNote,
      userRepositoryWithUser
    )
    const noteId = originalNote.id as string
    const result = await useCase.perform(noteId, newNote)
    const { title, content } = result.value as NoteData

    expect(result.value as NoteData).toEqual(newNote)
    expect(title).toBe(newNote.title)
    expect(content).toBe(newNote.content)
  })

  it(`Should not be able update title of existing note if user already has note 
    with same title`, async () => {
    const useCase = new UpdateNote(
      noteRepositoryWithNote,
      userRepositoryWithUser
    )
    const noteId = originalNote.id as string
    const result = await useCase.perform(noteId, originalNote)
    const error = result.value as Error

    expect(result).toEqual(left(new ExistingTitleError()))
    expect(error).toBeInstanceOf(ExistingTitleError)
    expect(error.name).toBe('ExistingTitleError')
    expect(error.message).toBe('User already has note with the same title.')
    expect(error.stack).toBeDefined()
  })

  it('Should not be able update note if not owner note', async () => {
    const useCase = new UpdateNote(
      noteRepositoryWithNote,
      userRepositoryWithUser
    )

    const changedNote = NoteDataBuilder.validNote()
      .withUnregisterOwnerEmail()
      .build()

    const noteId = originalNote.id as string
    const result = await useCase.perform(noteId, changedNote)
    const error = result.value as Error

    expect(result).toEqual(left(new UserNotOwnerError()))
    expect(error).toBeInstanceOf(UserNotOwnerError)
    expect(error.name).toBe('UserNotOwnerError')
    expect(error.message).toBe('user do not owner this note')
    expect(error.stack).toBeDefined()
  })
})
