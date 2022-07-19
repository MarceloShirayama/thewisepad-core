import { UserDataBuilder } from '@/tests/builders'
import { FakeTokenManager } from '@/tests/doubles/authentication'
import { FakeEncoder } from '@/tests/doubles/encoders'
import { InMemoryUserRepository } from '@/tests/doubles/repositories'
import { CustomAuthentication } from '@/use-cases/authentication/custom-authentication'
import {
  UserNotFoundError,
  WrongPasswordError
} from '@/use-cases/authentication/errors'
import { AuthenticationResult } from '@/use-cases/authentication/ports'
import { Encoder, UserData, UserRepository } from '@/use-cases/ports'
import { SignIn } from '@/use-cases/sign-in'

describe('Sign in use case', () => {
  const validUserSignInRequest: UserData = UserDataBuilder.validUser().build()

  const encoder: Encoder = new FakeEncoder()

  async function getSingleUserRepository(): Promise<UserRepository> {
    const password = await encoder.encode(validUserSignInRequest.password)
    const user = {
      id: validUserSignInRequest.id,
      email: validUserSignInRequest.email,
      password
    }

    return new InMemoryUserRepository([user])
  }

  it('Should correctly sign in if password is correct', async () => {
    const singleUserUserRepository: UserRepository =
      await getSingleUserRepository()

    const authentication = new CustomAuthentication(
      singleUserUserRepository,
      new FakeEncoder(),
      new FakeTokenManager()
    )
    const useCase = new SignIn(singleUserUserRepository, authentication)
    const response = await useCase.perform(validUserSignInRequest)
    const value = response.value as AuthenticationResult

    expect(response.isRight()).toBe(true)
    expect(value.id).toBe(validUserSignInRequest.id)
  })

  it('Should not sign in if password is incorrect', async () => {
    const singleUserUserRepository: UserRepository =
      await getSingleUserRepository()

    const authentication = new CustomAuthentication(
      singleUserUserRepository,
      new FakeEncoder(),
      new FakeTokenManager()
    )
    const useCase = new SignIn(singleUserUserRepository, authentication)
    const response = await useCase.perform(
      UserDataBuilder.validUser().withWrongPassword().build()
    )
    const value = response.value as UserData
    const error = value as unknown as Error

    expect(response.isLeft()).toBe(true)
    expect(value).toBeInstanceOf(WrongPasswordError)
    expect(error.name).toBe('WrongPasswordError')
    expect(error.message).toBe('Wrong password')
    expect(error.stack).toContain('WrongPasswordError: Wrong password')
  })

  it('Should not sign in with unregistered user', async () => {
    const singleUserUserRepository: UserRepository =
      await getSingleUserRepository()

    const authentication = new CustomAuthentication(
      singleUserUserRepository,
      new FakeEncoder(),
      new FakeTokenManager()
    )
    const useCase = new SignIn(singleUserUserRepository, authentication)
    const response = await useCase.perform(
      UserDataBuilder.validUser().withDifferentEmail().build()
    )
    const value = response.value as UserData
    const error = value as unknown as Error

    expect(response.isLeft()).toBe(true)
    expect(value).toBeInstanceOf(UserNotFoundError)
    expect(error.name).toBe('UserNotFoundError')
    expect(error.message).toBe('User not found')
    expect(error.stack).toContain('UserNotFoundError: User not found')
  })
})
