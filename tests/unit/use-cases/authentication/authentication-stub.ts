import { Either, right } from '@/shared'
import { UserDataBuilder } from '@/tests/unit/use-cases/builders'
import {
  UserNotFoundError,
  WrongPasswordError
} from '@/use-cases/authentication/errors'
import {
  AuthenticationParams,
  AuthenticationResult,
  AuthenticationService
} from '@/use-cases/authentication/ports'

class AuthenticationServiceStub implements AuthenticationService {
  async auth(
    _authenticationParams: AuthenticationParams
  ): Promise<
    Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>
  > {
    return right({
      accessToken: 'accessToken',
      id: UserDataBuilder.validUser().build().id as string
    })
  }
}

export const makeAuthenticationStub = new AuthenticationServiceStub()
