import { describe, expect, test } from "vitest";

import { UserData } from "@/entities/user-data";
import { SignUp } from "@/use-cases/sign-up/signup";
import { InMemoryUserRepository } from "./in-memory-user-repository";
import { FakeEncoder } from "./sign-up/fake-encoder";
import { ExistingUserError } from "@/use-cases/sign-up/errors/existing-user-error";

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

    expect(userSignupResponse.value).toEqual(userSignupRequest);

    const users = await userRepository.findAllUsers();

    expect(users.length).toBe(1);

    const user = await userRepository.findUserByEmail(validEmail);

    expect(user?.password).toBe(`${validPassword}-ENCRYPTED`);
  });

  test("Should not sign up existing user", async () => {
    const validEmail = "any@mail.com";
    const validPassword = "1valid_password";

    const userSignupRequest: UserData = {
      email: validEmail,
      password: validPassword,
    };

    const userRepository = new InMemoryUserRepository([]);

    const encoder = new FakeEncoder();

    const signUpUseCase = new SignUp(userRepository, encoder);

    await signUpUseCase.perform(userSignupRequest);
    const error = await signUpUseCase.perform(userSignupRequest);

    expect(error.value).toEqual(new ExistingUserError(userSignupRequest));
  });
});
