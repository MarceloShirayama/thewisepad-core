import { SignUpController } from '@/controllers'
import { HttpResponse } from '@/controllers/ports'
import { UserDataBuilder } from '@/tests/unit/use-cases/builders'
import { InMemoryUserRepository } from '@/tests/unit/use-cases/repositories'
import { FakeEncoder } from '@/tests/unit/use-cases/signup/fake-encoder'
import { Encoder, UserData, UserRepository } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'

describe('Sign up controller', () => {
  const emptyRepository: UserRepository = new InMemoryUserRepository([])

  const encoder: Encoder = new FakeEncoder()

  const SignUpUseCase: SignUp = new SignUp(emptyRepository, encoder)

  const validUserSignUpData: UserData = UserDataBuilder.validUser().build()

  const controller: SignUpController = new SignUpController(SignUpUseCase)

  it('Should return 200 and the registered user, if successful', async () => {
    const response: HttpResponse = await controller.handle(validUserSignUpData)

    const { statusCode, body } = response

    expect(statusCode).toBe(200)
    expect(body).toEqual({
      id: expect.any(String),
      email: validUserSignUpData.email,
      password: expect.any(String)
    })
  })

  it('Should return 403 when trying to sign up existing user', async () => {
    await controller.handle(validUserSignUpData)

    const response: HttpResponse = await controller.handle(validUserSignUpData)

    const { statusCode, body } = response
    const error = body as Error

    expect(statusCode).toBe(403)
    expect(error.name).toBe('ExistingUserError')
    expect(error.message).toBe(
      `User ${validUserSignUpData.email} already registered`
    )
    expect(error.stack).toBeDefined()
  })
})
