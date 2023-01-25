import { InvalidEmailError } from "@/entities/errors/invalid-email-error";
import { InvalidPasswordError } from "@/entities/errors/invalid-password-error";
import { User } from "@/entities/user";
import { UserData } from "@/entities/user-data";
import { Either, left, right } from "@/shared/either";
import { UserRepository } from "../ports/user-repository";
import { ExistingUserError } from "./errors/existing-user-error";
import { Encoder } from "./ports/encoder";

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
