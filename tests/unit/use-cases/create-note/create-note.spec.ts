import { InvalidTitleError } from '@/entities/errors'
import { UserData } from '@/entities/ports'
import { left } from '@/shared'
import { CreateNote } from '@/use-cases/create-note'
import {
  ExistingTitleError,
  UnregisteredOwnerError
} from '@/use-cases/create-note/errors'
import { NoteData, NoteRepository, UserRepository } from '@/use-cases/ports'
import { NoteDataBuilder, UserDataBuilder } from '../builders'
import { InMemoryNoteRepository, InMemoryUserRepository } from '../repositories'

describe('Create note use case', () => {
  const validRegisteredUser: UserData = UserDataBuilder.validUser().build()

  const userDataArrayWithSingleUser: UserData[] = new Array(validRegisteredUser)

  const emptyNoteRepository: NoteRepository = new InMemoryNoteRepository([])

  const singleUserUserRepository: UserRepository = new InMemoryUserRepository(
    userDataArrayWithSingleUser
  )

  const requestWithValidNote: NoteData = NoteDataBuilder.validNote().build()

  it('Should create note with valid user and title', async () => {
    const useCase = new CreateNote(
      emptyNoteRepository,
      singleUserUserRepository
    )

    const user = await singleUserUserRepository.add(validRegisteredUser)

    await useCase.perform(requestWithValidNote)
    const addedNotes: NoteData[] = await emptyNoteRepository.findAllFromUserId(
      user.id as string
    )

    expect(addedNotes.length).toBe(1)
    expect(addedNotes[0]).toEqual({
      title: requestWithValidNote.title,
      content: requestWithValidNote.content,
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
      NoteDataBuilder.validNote().withUnregisterOwnerEmail().build()
    )

    expect(response.value).toBeInstanceOf(UnregisteredOwnerError)
    expect((response.value as Error).name).toBe('UnregisteredOwnerError')
    expect(response.value).toEqual(new UnregisteredOwnerError())
  })

  it('Should not be able create note if invalid title', async () => {
    const useCase = new CreateNote(
      emptyNoteRepository,
      singleUserUserRepository
    )

    const response = await useCase.perform(
      NoteDataBuilder.validNote().withInvalidTitle().build()
    )

    expect(response.value).toBeInstanceOf(InvalidTitleError)
    expect((response.value as Error).name).toBe('InvalidTitleError')
  })

  it('Should not create note with existing title', async () => {
    const useCase = new CreateNote(
      emptyNoteRepository,
      singleUserUserRepository
    )

    await useCase.perform(requestWithValidNote)

    const response = await useCase.perform(requestWithValidNote)

    expect(response).toEqual(left(new ExistingTitleError()))
  })
})
