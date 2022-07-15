import { InvalidTitleError } from '@/entities/errors/invalid-title-error'
import { UserData } from '@/entities/user-data'
import { left } from '@/shared/either'
import { CreateNote } from '@/use-cases/create-note/create-note'
import { ExistingTitleError } from '@/use-cases/create-note/errors/existing-title-error'
import { UnregisteredOwnerError } from '@/use-cases/create-note/errors/invalid-owner-error'
import { NoteData } from '@/use-cases/ports/note-data'
import { NoteRepository } from '@/use-cases/ports/note-repository'
import { UserRepository } from '@/use-cases/ports/user-repository'
import { InMemoryNoteRepository } from '../in-memory-note-repository'
import { InMemoryUserRepository } from '../in-memory-user-repository'

describe('Create note use case', () => {
  const validEmail = 'valid@mail.com'
  const unregisteredEmail = 'other@mail.com'
  const validPassword = 'valid_password_1'
  const validTitle = 'valid note'
  const invalidTitle = ''
  const emptyContent = ''
  const emptyNoteRepository: NoteRepository = new InMemoryNoteRepository([])
  const validRegisteredUser: UserData = {
    email: validEmail,
    password: validPassword
  }
  const unregisteredUser: UserData = {
    email: unregisteredEmail,
    password: validPassword
  }

  const userDataArrayWithSingleUser: UserData[] = new Array(validRegisteredUser)

  const singleUserUserRepository: UserRepository = new InMemoryUserRepository(
    userDataArrayWithSingleUser
  )

  const validCreateNoteRequest: NoteData = {
    title: validTitle,
    content: emptyContent,
    ownerEmail: validRegisteredUser.email
  }

  const createNoteRequestWithUnregisteredOwner: NoteData = {
    title: validTitle,
    content: emptyContent,
    ownerEmail: unregisteredUser.email
  }

  const createNoteRequestWithInvalidTitle: NoteData = {
    title: invalidTitle,
    content: emptyContent,
    ownerEmail: validRegisteredUser.email
  }

  it('Should create note with valid user and title', async () => {
    const useCase = new CreateNote(
      emptyNoteRepository,
      singleUserUserRepository
    )

    const user = await singleUserUserRepository.add(validRegisteredUser)

    await useCase.perform(validCreateNoteRequest)
    const addedNotes: NoteData[] = await emptyNoteRepository.findAllFrom(
      user.id as string
    )

    expect(addedNotes.length).toBe(1)
    expect(addedNotes[0]).toEqual({
      title: validTitle,
      content: emptyContent,
      ownerId: user.id,
      ownerEmail: validRegisteredUser.email,
      id: expect.any(String)
    })
  })

  it('Should not create note with unregistered owner', async () => {
    const useCase = new CreateNote(
      emptyNoteRepository,
      singleUserUserRepository
    )

    const response = await useCase.perform(
      createNoteRequestWithUnregisteredOwner
    )

    expect(response.value).toBeInstanceOf(UnregisteredOwnerError)
    expect((response.value as Error).name).toBe('UnregisteredOwnerError')
    expect(response.value).toEqual(new UnregisteredOwnerError())
  })

  it('Should not create note with invalid title', async () => {
    const useCase = new CreateNote(
      emptyNoteRepository,
      singleUserUserRepository
    )

    const response = await useCase.perform(createNoteRequestWithInvalidTitle)

    expect(response.value).toBeInstanceOf(InvalidTitleError)
    expect((response.value as Error).name).toBe('InvalidTitleError')
  })

  it('Should not create note with existing title', async () => {
    const useCase = new CreateNote(
      emptyNoteRepository,
      singleUserUserRepository
    )

    await useCase.perform(validCreateNoteRequest)

    const response = await useCase.perform(validCreateNoteRequest)

    expect(response).toEqual(left(new ExistingTitleError()))
  })
})
