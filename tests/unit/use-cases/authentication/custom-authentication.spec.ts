import { UserDataBuilder } from '@/tests/unit/use-cases/builders'
import { FakeTokenManager } from '@/tests/unit/use-cases/doubles/authentication'
import { FakeEncoder } from '@/tests/unit/use-cases/doubles/encoders'
import { InMemoryUserRepository } from '@/tests/unit/use-cases/doubles/repositories'
import { CustomAuthentication } from '@/use-cases/authentication/custom-authentication'
import { AuthenticationResult } from '@/use-cases/authentication/ports'
import { UserData, UserRepository } from '@/use-cases/ports'

describe('Custom authentication', () => {
  async function getSingleUserRepository(): Promise<UserRepository> {
    const user = UserDataBuilder.validUser().build()

    user.password = await new FakeEncoder().encode(user.password)

    const userDataArrayWithSingleUser = [user]

    return new InMemoryUserRepository(userDataArrayWithSingleUser)
  }

  it(`Should correctly authenticate if user email and password is correct
    `, async () => {
    const singleUserRepository = await getSingleUserRepository()

    const validUserSignInRequest: UserData = UserDataBuilder.validUser().build()

    const fakeTokenManager = new FakeTokenManager()

    const authentication = new CustomAuthentication(
      singleUserRepository,
      new FakeEncoder(),
      fakeTokenManager
    )

    const response = await authentication.auth(validUserSignInRequest)
    const result = response.value as AuthenticationResult

    expect(result.id).toEqual('0')
    expect((await fakeTokenManager.verify(result.accessToken)).value).toEqual(
      validUserSignInRequest.id
    )
  })

  it('Should not authenticate with unregistered user', async () => {
    const singleUserRepository = await getSingleUserRepository()

    const unregisteredUserSignInRequest: UserData = UserDataBuilder.validUser()
      .withDifferentEmail()
      .build()

    const fakeTokenManager = new FakeTokenManager()

    const authentication = new CustomAuthentication(
      singleUserRepository,
      new FakeEncoder(),
      fakeTokenManager
    )

    const response = await authentication.auth(unregisteredUserSignInRequest)
    const error = response.value as Error

    expect(error.name).toEqual('UserNotFoundError')
    expect(error.message).toEqual('User not found')
    expect(error.stack).toBeDefined()
  })
})
