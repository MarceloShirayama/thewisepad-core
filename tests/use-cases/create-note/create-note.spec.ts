import { UserData } from '@/entities/user-data'
import { CreateNote } from '@/use-cases/create-note/create-note'
import { UnregisteredOwnerError } from '@/use-cases/create-note/errors/invalid-owner-error'
import { NoteData } from '@/use-cases/create-note/note-data'
import { NoteRepository } from '@/use-cases/create-note/ports/note-repository'
import { UserRepository } from '@/use-cases/ports/user-repository'
import { InMemoryUserRepository } from '../in-memory-user-repository'
import { InMemoryNoteRepository } from './in-memory-note-repository'

describe('Create note use case', () => {
  const validEmail = 'valid@mail.com'
  const unregisteredEmail = 'other@mail.com'
  const validPassword = 'valid_password_1'
  const validTitle = 'valid note'
  const emptyContent = ''
  const emptyNoteRepository: NoteRepository = new InMemoryNoteRepository([])
  const validRegisteredUser: UserData = {
    email: validEmail,
    password: validPassword,
    id: '0'
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

  it('Should create note with valid user and title', async () => {
    const useCase = new CreateNote(
      emptyNoteRepository,
      singleUserUserRepository
    )

    await useCase.perform(validCreateNoteRequest)

    const addedNotes: NoteData[] = await emptyNoteRepository.findAllNotesFrom(
      validRegisteredUser.id as string
    )

    expect(addedNotes.length).toBe(1)
    expect(addedNotes[0]).toMatchObject({
      title: validTitle,
      content: emptyContent,
      ownerId: validRegisteredUser.id,
      id: validRegisteredUser.id
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
})
