import { Either } from "../../shared";
import { UseCase, UserData } from "../../use-cases/ports";
import {
  AuthenticationResult,
  AuthenticationService,
} from "../authentication/ports";
import {
  UserNotFoundError,
  WrongPasswordError,
} from "../authentication/errors";

export class SignIn implements UseCase {
  constructor(private readonly authentication: AuthenticationService) {}

  async perform(
    sigInRequest: UserData
  ): Promise<
    Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>
  > {
    const authentication = await this.authentication.auth({
      email: sigInRequest.email,
      password: sigInRequest.password,
    });

    return authentication;
  }
}
