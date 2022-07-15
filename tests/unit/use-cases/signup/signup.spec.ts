import { InvalidEmailError } from '@/entities/errors/invalid-email-error'
import { InvalidPasswordError } from '@/entities/errors/invalid-password-error'
import { UserData } from '@/entities/user-data'
import { Encoder } from '@/use-cases/ports/encoder'
import { UserRepository } from '@/use-cases/ports/user-repository'
import { ExistingUserError } from '@/use-cases/sign-up/errors/existing-user-error'
import { SignUp } from '@/use-cases/sign-up/sign-up'
import { InMemoryUserRepository } from '../in-memory-user-repository'
import { FakeEncoder } from './fake-encoder'

describe('Sign up use case', () => {
  //  variables
  const validEmail = 'valid@mail.com'
  const invalidEmail = 'invalid_email'
  const validPassword = 'valid_password_1'
  const invalidPassword = '1abc'
  const validUserSignUpRequest: UserData = {
    email: validEmail,
    password: validPassword
  }

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

  // Sign up Use Case Data
  const userSignUpRequestWithInvalidEmail: UserData = {
    email: invalidEmail,
    password: validPassword
  }
  const userSignUpRequestWithInvalidPassword: UserData = {
    email: validEmail,
    password: invalidPassword
  }

  it('should sign up user with valid data', async () => {
    const sut: SignUp = new SignUp(emptyUserRepository, encoder)

    const userSignUpResponse = await sut.perform(validUserSignUpRequest)

    const userRepositoryLength = (await emptyUserRepository.findAllUsers())
      .length

    expect(userSignUpResponse.value).toEqual(
      expect.objectContaining({
        email: validUserSignUpRequest.email,
        password: `${validUserSignUpRequest.password}_ENCRYPTED`,
        id: expect.any(String)
      })
    )
    expect(userRepositoryLength).toEqual(1)
    expect(
      (await emptyUserRepository.findUserByEmail(validEmail)).password
    ).toEqual(`${validPassword}_ENCRYPTED`)
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

  it('Should not signup user with invalid password', async () => {
    const sut: SignUp = new SignUp(emptyUserRepository, encoder)

    const error = await sut.perform(userSignUpRequestWithInvalidPassword)

    expect((error.value as Error).name).toBe('InvalidPasswordError')
    expect(error.value).toEqual(new InvalidPasswordError())
  })
})
