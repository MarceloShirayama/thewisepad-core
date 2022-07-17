import { SignUpController } from '@/controllers'
import { HttpResponse } from '@/controllers/ports'
import { UserDataBuilder } from '@/tests/unit/use-cases/builders'
import { InMemoryUserRepository } from '@/tests/unit/use-cases/repositories'
import { FakeEncoder } from '@/tests/unit/use-cases/signup/fake-encoder'
import { Encoder, UserData, UserRepository } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'

describe('Sign up controller', () => {
  it('Should return 200 and the registered user, if successful', async () => {
    const emptyRepository: UserRepository = new InMemoryUserRepository([])

    const encoder: Encoder = new FakeEncoder()

    const useCase: SignUp = new SignUp(emptyRepository, encoder)

    const validUserSignUpData: UserData = UserDataBuilder.validUser().build()

    const controller: SignUpController = new SignUpController(useCase)

    const response: HttpResponse = await controller.handle(validUserSignUpData)

    const { statusCode, body } = response

    expect(statusCode).toBe(200)
    expect(body).toEqual(validUserSignUpData)
  })
})
