import { describe, expect, test } from "vitest";

import { UserData } from "@/entities/user-data";
import { SignUp } from "@/use-cases/sign-up/signup";
import { InMemoryUserRepository } from "../in-memory-user-repository";
import { FakeEncoder } from "./fake-encoder";
import { ExistingUserError } from "@/use-cases/sign-up/errors/existing-user-error";
import { InvalidPasswordError } from "@/entities/errors/invalid-password-error";
import { InvalidEmailError } from "@/entities/errors/invalid-email-error";

describe("SignUp use case", () => {
  const validEmail = "any@mail.com";
  const validPassword = "1valid_password";

  const invalidEmail = "invalid_email";
  const invalidPassword = "1abc";

  const userSignupRequest: UserData = {
    email: validEmail,
    password: validPassword,
  };

  const makeSut = () => {
    const userRepository = new InMemoryUserRepository([]);

    const encoder = new FakeEncoder();

    const signUpUseCase = new SignUp(userRepository, encoder);

    return { signUpUseCase, userRepository };
  };

  test("Should sign up user with valid data", async () => {
    const { signUpUseCase, userRepository } = makeSut();

    const userSignupResponse = await signUpUseCase.perform(userSignupRequest);

    expect(userSignupResponse.value).toEqual(userSignupRequest);

    const users = await userRepository.findAllUsers();

    expect(users.length).toBe(1);

    const user = await userRepository.findUserByEmail(validEmail);

    expect(user?.password).toBe(`${validPassword}-ENCRYPTED`);
  });

  test("Should not sign up existing user", async () => {
    const { signUpUseCase } = makeSut();

    await signUpUseCase.perform(userSignupRequest);
    const error = await signUpUseCase.perform(userSignupRequest);

    expect(error.value).toEqual(new ExistingUserError(userSignupRequest));
  });

  test("Should not sign up user with invalid password", async () => {
    const userSignupRequestWithInvalidPassword = {
      email: validEmail,
      password: invalidPassword,
    };

    const { signUpUseCase } = makeSut();

    const error = await signUpUseCase.perform(
      userSignupRequestWithInvalidPassword
    );

    expect(error.value).toEqual(
      new InvalidPasswordError(userSignupRequestWithInvalidPassword.password)
    );
  });

  test("Should not sign up user with invalid email", async () => {
    const userSignupRequestWithInvalidPassword = {
      email: invalidEmail,
      password: validPassword,
    };

    const { signUpUseCase } = makeSut();

    const error = await signUpUseCase.perform(
      userSignupRequestWithInvalidPassword
    );

    expect(error.value).toEqual(
      new InvalidEmailError(userSignupRequestWithInvalidPassword.email)
    );
  });
});
