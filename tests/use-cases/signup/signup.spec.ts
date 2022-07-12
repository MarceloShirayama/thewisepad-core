import { UserData } from '@/entities/user-data'
import { UserRepository } from '@/use-cases/ports/user-repository'
import { Encoder } from '@/use-cases/signup/ports/encoder'
import { Signup } from '@/use-cases/signup/signup'
import { InMemoryUserRepository } from '../in-memory-user-repository'
import { FakeEncoder } from './fake-encoder'

const validEmail = 'valid@mail.com'
const validPassword = 'valid-password_1'
const userSignupRequest: UserData = {
  email: validEmail,
  password: validPassword
}
const encoder: Encoder = new FakeEncoder()
const userRepository: UserRepository = new InMemoryUserRepository([])

const sut: Signup = new Signup(userRepository, encoder)

describe('Signup use case', () => {
  it('Should signup user with valid data', async () => {
    const userSignupResponse: UserData = await sut.perform(userSignupRequest)

    expect(userSignupResponse).toEqual(userSignupRequest)
    expect((await userRepository.findAllUsers()).length).toBe(1)
    expect((await userRepository.findUserByEmail(validEmail)).password).toBe(
      validPassword + 'ENCRYPTED'
    )
  })
})
