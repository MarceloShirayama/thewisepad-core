import { UserData } from '@/entities/user-data'
import { Encoder } from '@/use-cases/ports/encoder'
import { UserRepository } from '@/use-cases/ports/user-repository'
import { UserNotFoundError } from '@/use-cases/signin/errors/user-not-found-error'
import { WrongPasswordError } from '@/use-cases/signin/errors/wrong-password-error'
import { Signin } from '@/use-cases/signin/signin'
import { InMemoryUserRepository } from '../in-memory-user-repository'
import { FakeEncoder } from '../signup/fake-encoder'

describe('Signin use case', () => {
  const validEmail = 'valid@mail.com'
  const validPassword = 'valid_password_1'
  const wrongPassword = 'wrong_password'
  const unregisteredEmail = 'unregistered@mail.com'
  const validUserSigninRequest: UserData = {
    email: validEmail,
    password: validPassword
  }
  const signinRequestWithWrongPassword: UserData = {
    email: validEmail,
    password: wrongPassword
  }
  const signinRequestWithUnregisteredUser: UserData = {
    email: unregisteredEmail,
    password: validPassword
  }
  const userDataArrayWithSingleUser = new Array<UserData>({
    email: validEmail,
    password: `${validPassword}_ENCRYPTED`
  })
  const singleUserUserRepository: UserRepository = new InMemoryUserRepository(
    userDataArrayWithSingleUser
  )
  const encoder: Encoder = new FakeEncoder()

  it('Should correctly signin if password is correct', async () => {
    const useCase = new Signin(singleUserUserRepository, encoder)

    const response = await useCase.perform(validUserSigninRequest)
    const value = response.value as UserData

    expect(response.isRight()).toBe(true)
    expect(value).toBe(validUserSigninRequest)
  })

  it('Should not signin if password is incorrect', async () => {
    const useCase = new Signin(singleUserUserRepository, encoder)

    const response = await useCase.perform(signinRequestWithWrongPassword)
    const value = response.value as UserData
    const error = value as unknown as WrongPasswordError

    expect(response.isLeft()).toBe(true)
    expect(value).toBeInstanceOf(WrongPasswordError)
    expect(error.name).toBe('WrongPasswordError')
    expect(error.message).toBe('Wrong password')
    expect(error.stack).toContain('WrongPasswordError: Wrong password')
  })

  it('Should not signin with unregistered user', async () => {
    const useCase = new Signin(singleUserUserRepository, encoder)

    const response = await useCase.perform(signinRequestWithUnregisteredUser)
    const value = response.value as UserData
    const error = value as unknown as WrongPasswordError

    expect(response.isLeft()).toBe(true)
    expect(value).toBeInstanceOf(UserNotFoundError)
    expect(error.name).toBe('UserNotFoundError')
    expect(error.message).toBe('User not found')
    expect(error.stack).toContain('UserNotFoundError: User not found')
  })
})
