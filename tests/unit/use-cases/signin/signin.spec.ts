import { UserDataBuilder } from '@/tests/unit/use-cases/builders'
import { FakeEncoder } from '@/tests/unit/use-cases/encoders'
import { InMemoryUserRepository } from '@/tests/unit/use-cases/repositories'
import { Encoder, UserData, UserRepository } from '@/use-cases/ports'
import { SignIn } from '@/use-cases/sign-in'
import {
  UserNotFoundError,
  WrongPasswordError
} from '@/use-cases/sign-in/errors'

describe('Sign in use case', () => {
  const validUserSignInRequest: UserData = UserDataBuilder.validUser().build()

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
    const useCase = new SignIn(singleUserUserRepository, encoder)
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
