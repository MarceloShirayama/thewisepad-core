import { Either, left, right } from "@/shared";
import { Encoder, UserData, UserRepository } from "@/use-cases/ports";
import { UserNotFoundError, WrongPasswordError } from "./errors";

export class SignIn {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encoder: Encoder
  ) {}

  async perform(
    sigInRequest: UserData
  ): Promise<Either<UserNotFoundError | WrongPasswordError, UserData>> {
    const user = await this.userRepository.findByEmail(sigInRequest.email);

    if (!user) return left(new UserNotFoundError());

    const checkPassword = await this.encoder.compare(
      sigInRequest.password,
      user.password
    );

    return checkPassword ? right(sigInRequest) : left(new WrongPasswordError());
  }
}
