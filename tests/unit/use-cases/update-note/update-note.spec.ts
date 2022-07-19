import { left } from '@/shared'
import { NoteDataBuilder, UserDataBuilder } from '@/tests/builders'
import {
  InMemoryNoteRepository,
  InMemoryUserRepository
} from '@/tests/doubles/repositories'
import { ExistingTitleError } from '@/use-cases/create-note/errors'
import { NoteData, NoteRepository, UserRepository } from '@/use-cases/ports'
import { UpdateNote } from '@/use-cases/update-note'

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
    const result = await useCase.perform(newNote)
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
    const result = await useCase.perform(originalNote)
    const error = result.value as Error

    expect(result).toEqual(left(new ExistingTitleError()))
    expect(error).toBeInstanceOf(ExistingTitleError)
    expect(error.name).toBe('ExistingTitleError')
    expect(error.message).toBe('User already has note with the same title.')
    expect(error.stack).toBeDefined()
  })
})
