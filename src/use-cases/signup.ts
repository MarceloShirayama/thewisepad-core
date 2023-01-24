import { UserData } from "@/entities/user-data";
import { UserRepository } from "./ports/user-repository";
import { Encoder } from "./signup/ports/encoder";

export class Signup {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encoder: Encoder
  ) {}

  async perform(userSignupRequest: UserData): Promise<UserData> {
    const encodePassword = await this.encoder.encode(
      userSignupRequest.password
    );

    this.userRepository.addUser({
      email: userSignupRequest.email,
      password: encodePassword,
    });

    return userSignupRequest;
  }
}
