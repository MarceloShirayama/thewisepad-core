import { UserData } from "@/entities/user-data";
import { SignUp } from "@/use-cases/signup";
import { describe, expect, test } from "vitest";
import { InMemoryUserRepository } from "./in-memory-user-repository";
import { FakeEncoder } from "./sign-up/fake-encoder";

describe("SignUp use case", () => {
  test("Should sign up user with valid data", async () => {
    const validEmail = "any@mail.com";
    const validPassword = "1valid_password";

    const userSignupRequest: UserData = {
      email: validEmail,
      password: validPassword,
    };

    const userRepository = new InMemoryUserRepository([]);

    const encoder = new FakeEncoder();

    const signUpUseCase = new SignUp(userRepository, encoder);

    const userSignupResponse = await signUpUseCase.perform(userSignupRequest);
    console.log({ userSignupRequest, userSignupResponse });

    expect(userSignupResponse).toEqual(userSignupRequest);

    const users = await userRepository.findAllUsers();

    expect(users.length).toBe(1);

    const user = await userRepository.findUserByEmail(validEmail);

    expect(user?.password).toBe(`${validPassword}-ENCRYPTED`);
  });
});
