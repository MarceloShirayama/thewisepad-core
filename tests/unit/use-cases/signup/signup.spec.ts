import { InvalidEmailError } from '@/entities/errors/invalid-email-error'
import { InvalidPasswordError } from '@/entities/errors/invalid-password-error'
import { UserData } from '@/entities/user-data'
import { Encoder } from '@/use-cases/ports/encoder'
import { UserRepository } from '@/use-cases/ports/user-repository'
import { ExistingUserError } from '@/use-cases/sign-up/errors/existing-user-error'
import { SignUp } from '@/use-cases/sign-up/sign-up'
import { UserDataBuilder } from '../builders/user-builder'
import { InMemoryUserRepository } from '../in-memory-user-repository'
import { FakeEncoder } from './fake-encoder'

describe('Sign up use case', () => {
  //  variables
  const validUserSignUpRequest: UserData = UserDataBuilder.validUser().build()

  // repositories
  const emptyUserRepository: UserRepository = new InMemoryUserRepository([])
  const userDataArrayWithSingleUser: UserData[] = new Array(
    validUserSignUpRequest
  )
  const singleUserUserRepository: UserRepository = new InMemoryUserRepository(
    userDataArrayWithSingleUser
  )

  // encoders
  const encoder: Encoder = new FakeEncoder()

  // Sign up use case data
  const userSignUpRequestWithInvalidEmail: UserData =
    UserDataBuilder.validUser().withInvalidEmail().build()
  const userSignUpRequestWithPasswordWithoutNumber: UserData =
    UserDataBuilder.validUser().withPasswordWithoutNumber().build()

  const userSignUpRequestWithPasswordWithFewChars: UserData =
    UserDataBuilder.validUser().withPasswordWithoutNumber().build()

  it('should sign up user with valid data', async () => {
    const sut: SignUp = new SignUp(emptyUserRepository, encoder)

    const userSignUpResponse = await sut.perform(validUserSignUpRequest)

    const userRepositoryLength = (await emptyUserRepository.findAll()).length

    expect(userSignUpResponse.value).toEqual(
      expect.objectContaining({
        email: validUserSignUpRequest.email,
        password: `${validUserSignUpRequest.password}_ENCRYPTED`,
        id: expect.any(String)
      })
    )
    expect(userRepositoryLength).toEqual(1)
    expect(
      (await emptyUserRepository.findByEmail(validUserSignUpRequest.email))
        .password
    ).toEqual(`${validUserSignUpRequest.password}_ENCRYPTED`)
  })

  it('should not sign up existing user', async () => {
    const sut: SignUp = new SignUp(singleUserUserRepository, encoder)
    const error = await sut.perform(validUserSignUpRequest)
    expect(error.value).toEqual(new ExistingUserError(validUserSignUpRequest))
  })

  it('Should not sign up user with invalid email', async () => {
    const sut: SignUp = new SignUp(emptyUserRepository, encoder)

    const error = await sut.perform(userSignUpRequestWithInvalidEmail)

    expect((error.value as Error).name).toBe('InvalidEmailError')
    expect(error.value).toEqual(
      new InvalidEmailError(userSignUpRequestWithInvalidEmail.email)
    )
  })

  it('Should not sign up user with password without number', async () => {
    const sut: SignUp = new SignUp(emptyUserRepository, encoder)

    const error = await sut.perform(userSignUpRequestWithPasswordWithoutNumber)

    expect((error.value as Error).name).toBe('InvalidPasswordError')
    expect(error.value).toEqual(new InvalidPasswordError())
  })

  it('Should not sign up user with password with few chars', async () => {
    const sut: SignUp = new SignUp(emptyUserRepository, encoder)

    const error = await sut.perform(userSignUpRequestWithPasswordWithFewChars)

    expect((error.value as Error).name).toBe('InvalidPasswordError')
    expect(error.value).toEqual(new InvalidPasswordError())
  })
})
