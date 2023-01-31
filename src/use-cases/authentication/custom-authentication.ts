import { Either, left, right } from "../../shared";
import { UserRepository, Encoder } from "../ports";
import { UserNotFoundError, WrongPasswordError } from "../sign-in/errors";
import {
  AuthenticationParams,
  AuthenticationResult,
  AuthenticationService,
  TokenManager,
} from "./ports";

export class CustomAuthentication implements AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encoder: Encoder,
    private readonly tokeManager: TokenManager
  ) {}

  async auth(
    authenticationParams: AuthenticationParams
  ): Promise<
    Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>
  > {
    const userExists = await this.userRepository.findByEmail(
      authenticationParams.email
    );

    if (userExists) {
      const isValid = await this.encoder.compare(
        authenticationParams.password,
        userExists!.password
      );

      const id = userExists.id as string;

      if (!isValid) return left(new WrongPasswordError());

      const accessToken = await this.tokeManager.sign(id);

      await this.userRepository.updateAccessToken(id, accessToken);

      const authentication: AuthenticationResult = {
        accessToken,
        id,
      };

      return right(authentication);
    }

    return left(new UserNotFoundError());
  }
}
