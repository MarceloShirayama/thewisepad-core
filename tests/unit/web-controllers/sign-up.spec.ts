import { UserDataBuilder } from '@/tests/unit/use-cases/builders'
import { FakeEncoder } from '@/tests/unit/use-cases/encoders'
import { InMemoryUserRepository } from '@/tests/unit/use-cases/repositories'
import { Encoder, UseCase, UserData, UserRepository } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'
import { SignUpController } from '@/web-controllers'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'

describe('Sign up controller', () => {
  const emptyRepository: UserRepository = new InMemoryUserRepository([])

  const encoder: Encoder = new FakeEncoder()

  const SignUpUseCase: UseCase = new SignUp(emptyRepository, encoder)

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

  class ErrorThrowingSignUpUseCaseStub implements UseCase<UserData, void> {
    public async perform(_request: UserData): Promise<void> {
      throw Error()
    }
  }

  const errorThrowingSignUpUseCaseStub: UseCase<UserData, void> =
    new ErrorThrowingSignUpUseCaseStub()

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

  it(`Should return 400 when trying to sign up user with missing email
  `, async () => {
    const userSignUpRequestWithMissingEmail: HttpRequest = {
      body: { password: validUserSignUpData.password }
    }

    const response: HttpResponse = await controller.handle(
      userSignUpRequestWithMissingEmail
    )

    const { statusCode, body } = response
    const error = body as Error

    expect(statusCode).toBe(400)
    expect(error.name).toBe('MissingParamError')
    expect(error.message).toBe('Missing param: email')
    expect(error.stack).toBeDefined()
  })

  it(`Should return 400 when trying to sign up user with missing password
  `, async () => {
    const userSignUpRequestWithMissingPassword: HttpRequest = {
      body: { email: validUserSignUpData.email }
    }

    const response: HttpResponse = await controller.handle(
      userSignUpRequestWithMissingPassword
    )

    const { statusCode, body } = response
    const error = body as Error

    expect(statusCode).toBe(400)
    expect(error.name).toBe('MissingParamError')
    expect(error.message).toBe('Missing param: password')
    expect(error.stack).toBeDefined()
  })

  it(`Should return 400 when trying to sign up user with missing email, and password
  `, async () => {
    const userSignUpRequestWithMissingEmailAndPassword: HttpRequest = {
      body: {}
    }

    const response: HttpResponse = await controller.handle(
      userSignUpRequestWithMissingEmailAndPassword
    )

    const { statusCode, body } = response
    const error = body as Error

    expect(statusCode).toBe(400)
    expect(error.name).toBe('MissingParamError')
    expect(error.message).toBe('Missing param: email, password')
    expect(error.stack).toBeDefined()
  })

  it('Should return 500 if an error is raised internally', async () => {
    const controllerWithStubUseCase: SignUpController = new SignUpController(
      errorThrowingSignUpUseCaseStub
    )

    const response: HttpResponse = await controllerWithStubUseCase.handle(
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
