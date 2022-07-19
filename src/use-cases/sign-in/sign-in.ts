import { Either } from '@/shared/either'
import {
  UserNotFoundError,
  WrongPasswordError
} from '@/use-cases/authentication/errors'
import { UseCase, UserData } from '@/use-cases/ports'
import {
  AuthenticationResult,
  AuthenticationService
} from '../authentication/ports'

export class SignIn
  implements UseCase<UserData, Either<Error, AuthenticationResult>>
{
  constructor(private readonly authentication: AuthenticationService) {}

  public async perform(
    signInRequest: UserData
  ): Promise<
    Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>
  > {
    return await this.authentication.auth({
      email: signInRequest.email,
      password: signInRequest.password
    })
  }
}
