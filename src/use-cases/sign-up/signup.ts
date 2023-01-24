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
  ): Promise<Either<ExistingUserError, UserData>> {
    const userAlreadyExists = await this.userRepository.findUserByEmail(
      userSignupRequest.email
    );

    if (userAlreadyExists)
      return left(new ExistingUserError(userSignupRequest));

    const encodePassword = await this.encoder.encode(
      userSignupRequest.password
    );

    await this.userRepository.addUser({
      email: userSignupRequest.email,
      password: encodePassword,
    });

    return right(userSignupRequest);
  }
}
