import { UserData } from '@/entities/user-data'
import { UserRepository } from '@/use-cases/ports/user-repository'
import { ExistingUserError } from '@/use-cases/signup/errors/existing-user-error'
import { Encoder } from '@/use-cases/signup/ports/encoder'
import { Signup } from '@/use-cases/signup/signup'
import { InMemoryUserRepository } from '@tests/use-cases/in-memory-user-repository'
import { FakeEncoder } from './fake-encoder'

const validEmail = 'valid@mail.com'
const validPassword = 'valid_password_1'
const validUserSignupRequest: UserData = {
  email: validEmail,
  password: validPassword
}
const emptyUserRepository: UserRepository = new InMemoryUserRepository([])
const userDataArrayWithSingleUser: UserData[] = new Array(
  validUserSignupRequest
)
const singleUserUserRepository: UserRepository = new InMemoryUserRepository(
  userDataArrayWithSingleUser
)
const encoder: Encoder = new FakeEncoder()

describe('Signup use case', () => {
  it('should signup user with valid data', async () => {
    const sut: Signup = new Signup(emptyUserRepository, encoder)

    const userSignupResponse = await sut.perform(validUserSignupRequest)

    expect(userSignupResponse.value).toEqual(validUserSignupRequest)
    expect((await emptyUserRepository.findAllUsers()).length).toEqual(1)
    expect(
      (await emptyUserRepository.findUserByEmail(validEmail)).password
    ).toEqual(validPassword + 'ENCRYPTED')
  })

  it('should not signup existing user', async () => {
    const sut: Signup = new Signup(singleUserUserRepository, encoder)
    const error = await sut.perform(validUserSignupRequest)
    expect(error.value).toEqual(new ExistingUserError(validUserSignupRequest))
  })
})
