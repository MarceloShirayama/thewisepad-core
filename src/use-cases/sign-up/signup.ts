import { User } from "@/entities";
import { InvalidEmailError, InvalidPasswordError } from "@/entities/errors";
import { Either, left, right } from "@/shared";
import { Encoder, UserData, UserRepository } from "@/use-cases/ports";
import { ExistingUserError } from "./errors";

export class SignUp {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encoder: Encoder
  ) {}

  async perform(
    userSignupRequest: UserData
  ): Promise<
    Either<
      ExistingUserError | InvalidEmailError | InvalidPasswordError,
      UserData
    >
  > {
    const userOrError = User.create(userSignupRequest);

    if (userOrError.isLeft()) return left(userOrError.value);

    const userAlreadyExists = await this.userRepository.findUserByEmail(
      userSignupRequest.email
    );

    if (userAlreadyExists)
      return left(new ExistingUserError(userSignupRequest));

    const encodePassword = await this.encoder.encode(
      userSignupRequest.password
    );

    const user = await this.userRepository.addUser({
      email: userSignupRequest.email,
      password: encodePassword,
    });

    return right(user);
  }
}
