import { User } from "../../entities";
import { InvalidEmailError, InvalidPasswordError } from "../../entities/errors";
import { Either, left, right } from "../../shared";
import { Encoder, UserData, UserRepository } from "../ports";
import { UseCase } from "../ports";
import {
  AuthenticationResult,
  AuthenticationService,
} from "../authentication/ports";
import { ExistingUserError } from "./errors";

export class SignUp implements UseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encoder: Encoder,
    private readonly authentication: AuthenticationService
  ) {}

  async perform(
    userSignupRequest: UserData
  ): Promise<
    Either<
      ExistingUserError | InvalidEmailError | InvalidPasswordError,
      AuthenticationResult
    >
  > {
    const userOrError = User.create(userSignupRequest);

    if (userOrError.isLeft()) return left(userOrError.value);

    const userAlreadyExists = await this.userRepository.findByEmail(
      userSignupRequest.email
    );

    if (userAlreadyExists)
      return left(new ExistingUserError(userSignupRequest));

    const encodePassword = await this.encoder.encode(
      userSignupRequest.password
    );

    const user = await this.userRepository.add({
      email: userSignupRequest.email,
      password: encodePassword,
    });

    const authentication = await this.authentication.auth({
      email: userSignupRequest.email,
      password: userSignupRequest.password,
    });

    const authenticationResult = authentication.value as AuthenticationResult;

    return right(authenticationResult);
  }
}
