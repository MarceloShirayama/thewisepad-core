import { UserData } from '@/entities/user-data'
import { Encoder } from '@/use-cases/ports/encoder'
import { UserRepository } from '@/use-cases/ports/user-repository'
import { UserNotFoundError } from '@/use-cases/sign-in/errors/user-not-found-error'
import { WrongPasswordError } from '@/use-cases/sign-in/errors/wrong-password-error'
import { SignIn } from '@/use-cases/sign-in/sign-in'
import { UserDataBuilder } from '../builders/user-builder'
import { InMemoryUserRepository } from '../in-memory-user-repository'
import { FakeEncoder } from '../signup/fake-encoder'

describe('Sign in use case', () => {
  const wrongPassword = 'wrong_password'
  const unregisteredEmail = 'unregistered@mail.com'
  const validUserSignInRequest: UserData = UserDataBuilder.validUser().build()
  const signInRequestWithWrongPassword: UserData = {
    email: validUserSignInRequest.email,
    password: wrongPassword
  }
  const signInRequestWithUnregisteredUser: UserData = {
    email: unregisteredEmail,
    password: validUserSignInRequest.password
  }
  const userDataArrayWithSingleUser = new Array<UserData>({
    email: validUserSignInRequest.email,
    password: `${validUserSignInRequest.password}_ENCRYPTED`
  })
  const singleUserUserRepository: UserRepository = new InMemoryUserRepository(
    userDataArrayWithSingleUser
  )
  const encoder: Encoder = new FakeEncoder()

  it('Should correctly sign in if password is correct', async () => {
    const useCase = new SignIn(singleUserUserRepository, encoder)

    const response = await useCase.perform(validUserSignInRequest)
    const value = response.value as UserData

    expect(response.isRight()).toBe(true)
    expect(value).toBe(validUserSignInRequest)
  })

  it('Should not sign in if password is incorrect', async () => {
    const useCase = new SignIn(singleUserUserRepository, encoder)

    const response = await useCase.perform(signInRequestWithWrongPassword)
    const value = response.value as UserData
    const error = value as unknown as Error

    expect(response.isLeft()).toBe(true)
    expect(value).toBeInstanceOf(WrongPasswordError)
    expect(error.name).toBe('WrongPasswordError')
    expect(error.message).toBe('Wrong password')
    expect(error.stack).toContain('WrongPasswordError: Wrong password')
  })

  it('Should not sign in with unregistered user', async () => {
    const useCase = new SignIn(singleUserUserRepository, encoder)

    const response = await useCase.perform(signInRequestWithUnregisteredUser)
    const value = response.value as UserData
    const error = value as unknown as Error

    expect(response.isLeft()).toBe(true)
    expect(value).toBeInstanceOf(UserNotFoundError)
    expect(error.name).toBe('UserNotFoundError')
    expect(error.message).toBe('User not found')
    expect(error.stack).toContain('UserNotFoundError: User not found')
  })
})
