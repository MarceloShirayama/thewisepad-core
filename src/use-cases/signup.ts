import { UserData } from "@/entities/user-data";
import { UserRepository } from "./ports/user-repository";
import { Encoder } from "./sign-up/ports/encoder";

export class SignUp {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encoder: Encoder
  ) {}

  async perform(userSignupRequest: UserData): Promise<UserData> {
    const encodePassword = await this.encoder.encode(
      userSignupRequest.password
    );

    await this.userRepository.addUser({
      email: userSignupRequest.email,
      password: encodePassword,
    });

    return userSignupRequest;
  }
}
