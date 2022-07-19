import { User } from '@/entities'
import { InvalidEmailError, InvalidPasswordError } from '@/entities/errors'
import { Either, left, right } from '@/shared'
import {
  AuthenticationResult,
  AuthenticationService
} from '@/use-cases/authentication/ports'
import { Encoder, UseCase, UserData, UserRepository } from '@/use-cases/ports'
import { ExistingUserError } from '@/use-cases/sign-up/errors'

export class SignUp
  implements UseCase<UserData, Either<Error, AuthenticationResult>>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encoder: Encoder,
    private readonly authentication: AuthenticationService
  ) {}

  public async perform(
    userSignupRequest: UserData
  ): Promise<
    Either<
      ExistingUserError | InvalidEmailError | InvalidPasswordError,
      AuthenticationResult
    >
  > {
    const userOrError = User.create(
      userSignupRequest.email,
      userSignupRequest.password
    )

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const userAlreadyExists = await this.userRepository.findByEmail(
      userSignupRequest.email
    )

    if (userAlreadyExists) {
      return left(new ExistingUserError(userSignupRequest))
    }

    const encodedPassword = await this.encoder.encode(
      userSignupRequest.password
    )

    await this.userRepository.add({
      email: userSignupRequest.email,
      password: encodedPassword
    })

    const authenticationResult = await this.authentication.auth({
      email: userSignupRequest.email,
      password: userSignupRequest.password
    })

    const result = authenticationResult.value as AuthenticationResult

    return right(result)
  }
}
