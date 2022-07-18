import { UserDataBuilder } from '@/tests/unit/use-cases/builders'
import { InMemoryUserRepository } from '@/tests/unit/use-cases/repositories'
import { FakeEncoder } from '@/tests/unit/use-cases/signup/fake-encoder'
import { Encoder, UserData, UserRepository } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'
import { SignUpController } from '@/web-controllers'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'

describe('Sign up controller', () => {
  const emptyRepository: UserRepository = new InMemoryUserRepository([])

  const encoder: Encoder = new FakeEncoder()

  const SignUpUseCase: SignUp = new SignUp(emptyRepository, encoder)

  const validUserSignUpData: UserData = UserDataBuilder.validUser().build()

  const validUserSignUpRequest: HttpRequest = {
    body: validUserSignUpData
  }

  const controller: SignUpController = new SignUpController(SignUpUseCase)

  const userSignUpDataWithInvalidEmail: UserData = UserDataBuilder.validUser()
    .withInvalidEmail()
    .build()

  const userSignUpRequestWithInvalidEmail: HttpRequest = {
    body: userSignUpDataWithInvalidEmail
  }

  const userSignupDataWithInvalidPassword: UserData =
    UserDataBuilder.validUser().withPasswordWithFewChars().build()

  const userSignupRequestWithInvalidPassword: HttpRequest = {
    body: userSignupDataWithInvalidPassword
  }

  it('Should return 201 and the registered user, if successful', async () => {
    const response: HttpResponse = await controller.handle(
      validUserSignUpRequest
    )

    const { statusCode, body } = response

    expect(statusCode).toBe(201)
    expect(body).toEqual({
      id: expect.any(String),
      email: validUserSignUpData.email,
      password: expect.any(String)
    })
  })

  it('Should return 403 when trying to sign up existing user', async () => {
    await controller.handle(validUserSignUpRequest)

    const response: HttpResponse = await controller.handle(
      validUserSignUpRequest
    )

    const { statusCode, body } = response
    const error = body as Error

    expect(statusCode).toBe(403)
    expect(error.name).toBe('ExistingUserError')
    expect(error.message).toBe(
      `User ${validUserSignUpData.email} already registered`
    )
    expect(error.stack).toBeDefined()
  })

  it(`Should return 400 when trying to sign up user with invalid email
    `, async () => {
    const response: HttpResponse = await controller.handle(
      userSignUpRequestWithInvalidEmail
    )

    const { statusCode, body } = response
    const error = body as Error

    expect(statusCode).toBe(400)
    expect(error.name).toBe('InvalidEmailError')
    expect(error.message).toBe(
      `Invalid email: ${userSignUpDataWithInvalidEmail.email}.`
    )
    expect(error.stack).toBeDefined()
  })

  it(`Should return 400 when trying to sign up user with invalid password
    `, async () => {
    const response: HttpResponse = await controller.handle(
      userSignupRequestWithInvalidPassword
    )

    const { statusCode, body } = response
    const error = body as Error

    expect(statusCode).toBe(400)
    expect(error.name).toBe('InvalidPasswordError')
    expect(error.message).toBe('Invalid password')
    expect(error.stack).toBeDefined()
  })

  it('Should return 500 if an error is raised internally', async () => {
    SignUp.prototype.perform = jest.fn().mockImplementationOnce(() => {
      throw new Error()
    })

    const controllerWithMockedUseCase: SignUpController = new SignUpController(
      SignUpUseCase
    )

    const response: HttpResponse = await controllerWithMockedUseCase.handle(
      validUserSignUpRequest
    )

    const { statusCode, body } = response
    const error = body as Error

    expect(statusCode).toBe(500)
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('InternalServerError')
    expect(error.message).toBe('Internal server error')
    expect(error.stack).toBeDefined()
  })
})
