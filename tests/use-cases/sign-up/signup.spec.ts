import { describe, expect, test } from "vitest";

import { InvalidEmailError, InvalidPasswordError } from "@/entities/errors";
import { UserData } from "@/use-cases/ports";
import { SignUp } from "@/use-cases/sign-up";
import { ExistingUserError } from "@/use-cases/sign-up/errors";
import { FakeEncoder } from "tests/doubles/encoder";
import { InMemoryUserRepository } from "tests/doubles/repositories";
import { UserBuilder } from "tests/doubles/builders/user-builder";

describe("SignUp use case", () => {
  const validUserSignupRequest: UserData = UserBuilder.createUser().build();

  const userSignupRequestWithInvalidPassword = UserBuilder.createUser()
    .withPasswordWithTooFewChars()
    .build();

  const userSignupRequestWithInvalidEmail = UserBuilder.createUser()
    .withInvalidEmail()
    .build();

  const makeSut = () => {
    const userRepository = new InMemoryUserRepository([]);

    const encoder = new FakeEncoder();

    const signUpUseCase = new SignUp(userRepository, encoder);

    return { signUpUseCase, userRepository };
  };

  test("Should sign up user with valid data", async () => {
    const { signUpUseCase, userRepository } = makeSut();

    const response = await signUpUseCase.perform(validUserSignupRequest);

    expect(response.value).toHaveProperty("id");
    expect(response.value).toHaveProperty(
      "email",
      validUserSignupRequest.email
    );
    expect(response.value).toHaveProperty(
      "password",
      `${validUserSignupRequest.password}-ENCRYPTED`
    );

    const users = await userRepository.findAll();

    expect(users.length).toBe(1);

    const user = await userRepository.findByEmail(validUserSignupRequest.email);

    expect(user?.password).toBe(`${validUserSignupRequest.password}-ENCRYPTED`);
  });

  test("Should not sign up existing user", async () => {
    const { signUpUseCase } = makeSut();

    await signUpUseCase.perform(validUserSignupRequest);
    const error = await signUpUseCase.perform(validUserSignupRequest);

    expect(error.value).toEqual(new ExistingUserError(validUserSignupRequest));
  });

  test("Should not sign up user with invalid password", async () => {
    const { signUpUseCase } = makeSut();

    const error = await signUpUseCase.perform(
      userSignupRequestWithInvalidPassword
    );

    expect(error.value).toEqual(
      new InvalidPasswordError(userSignupRequestWithInvalidPassword.password)
    );
  });

  test("Should not sign up user with invalid email", async () => {
    const { signUpUseCase } = makeSut();

    const error = await signUpUseCase.perform(
      userSignupRequestWithInvalidEmail
    );

    expect(error.value).toEqual(
      new InvalidEmailError(userSignupRequestWithInvalidEmail.email)
    );
  });
});
