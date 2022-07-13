import { InvalidEmailError } from '@/entities/errors/invalid-email-error'
import { InvalidPasswordError } from '@/entities/errors/invalid-password-error'
import { UserData } from '@/entities/user-data'
import { UserRepository } from '@/use-cases/ports/user-repository'
import { ExistingUserError } from '@/use-cases/signup/errors/existing-user-error'
import { Encoder } from '@/use-cases/signup/ports/encoder'
import { Signup } from '@/use-cases/signup/signup'
import { InMemoryUserRepository } from '@tests/use-cases/in-memory-user-repository'
import { FakeEncoder } from './fake-encoder'

//  variables
const validEmail = 'valid@mail.com'
const invalidEmail = 'invalid_email'
const validPassword = 'valid_password_1'
const invalidPassword = '1abc'
const validUserSignupRequest: UserData = {
  email: validEmail,
  password: validPassword
}

// repositories
const emptyUserRepository: UserRepository = new InMemoryUserRepository([])
const userDataArrayWithSingleUser: UserData[] = new Array(
  validUserSignupRequest
)
const singleUserUserRepository: UserRepository = new InMemoryUserRepository(
  userDataArrayWithSingleUser
)

// encoders
const encoder: Encoder = new FakeEncoder()

// Signup Use Case Data
const userSignupRequestWithInvalidEmail: UserData = {
  email: invalidEmail,
  password: validPassword
}
const userSignupRequestWithInvalidPassword: UserData = {
  email: validEmail,
  password: invalidPassword
}

describe('Signup use case', () => {
  it('should signup user with valid data', async () => {
    const sut: Signup = new Signup(emptyUserRepository, encoder)

    const userSignupResponse = await sut.perform(validUserSignupRequest)

    const userRepositoryLength = (await emptyUserRepository.findAllUsers())
      .length

    expect(userSignupResponse.value).toEqual({
      id: (userRepositoryLength - 1).toString(),
      email: validUserSignupRequest.email,
      password: validUserSignupRequest.password + 'ENCRYPTED'
    })
    expect(userRepositoryLength).toEqual(1)
    expect(
      (await emptyUserRepository.findUserByEmail(validEmail)).password
    ).toEqual(validPassword + 'ENCRYPTED')
  })

  it('should not signup existing user', async () => {
    const sut: Signup = new Signup(singleUserUserRepository, encoder)
    const error = await sut.perform(validUserSignupRequest)
    expect(error.value).toEqual(new ExistingUserError(validUserSignupRequest))
  })

  it('Should not signup user with invalid email', async () => {
    const sut: Signup = new Signup(emptyUserRepository, encoder)

    const error = await sut.perform(userSignupRequestWithInvalidEmail)

    expect((error.value as Error).name).toBe('InvalidEmailError')
    expect(error.value).toEqual(
      new InvalidEmailError(userSignupRequestWithInvalidEmail.email)
    )
  })

  it('Should not signup user with invalid password', async () => {
    const sut: Signup = new Signup(emptyUserRepository, encoder)

    const error = await sut.perform(userSignupRequestWithInvalidPassword)

    expect((error.value as Error).name).toBe('InvalidPasswordError')
    expect(error.value).toEqual(new InvalidPasswordError())
  })
})
