import { Either, right } from "src/shared";
import {
  AuthenticationParams,
  AuthenticationResult,
  AuthenticationService,
} from "src/use-cases/authentication/ports";
import {
  UserNotFoundError,
  WrongPasswordError,
} from "src/use-cases/authentication/errors";
import { UserBuilder } from "test/builders/user-builder";

export function makeAuthenticationServiceStub() {
  const validUser = UserBuilder.createUser().build();

  class AuthenticationServiceStub implements AuthenticationService {
    async auth(
      authenticationParams: AuthenticationParams
    ): Promise<
      Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>
    > {
      return right({
        accessToken: "accessToken",
        id: validUser.id as string,
      });
    }
  }
  const authenticationServiceStub = new AuthenticationServiceStub();

  return { authenticationServiceStub };
}
