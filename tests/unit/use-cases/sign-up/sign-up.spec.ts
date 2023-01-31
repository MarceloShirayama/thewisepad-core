import { describe, expect, test } from "vitest";

import { InvalidEmailError, InvalidPasswordError } from "src/entities/errors";
import { UserData } from "src/use-cases/ports";
import { SignUp } from "src/use-cases/sign-up";
import { ExistingUserError } from "src/use-cases/sign-up/errors";
import { UserBuilder } from "tests/builders/user-builder";
import { makeAuthenticationServiceStub } from "tests/doubles/authentication/authentication-stub";
import { FakeEncoder } from "tests/doubles/encoder";
import { InMemoryUserRepository } from "tests/doubles/repositories";

describe("SignUp use case", () => {
  const validUser: UserData = UserBuilder.createUser().build();

  function makeSut() {
    const validUserWithHashPassword = UserBuilder.createUser()
      .withHashPassword()
      .build();

    const userWithInvalidPassword = UserBuilder.createUser()
      .withPasswordWithTooFewChars()
      .build();

    const userWithInvalidEmail = UserBuilder.createUser()
      .withInvalidEmail()
      .build();

    const userRepository = new InMemoryUserRepository([]);

    const encoder = new FakeEncoder();

    const { authenticationServiceStub } = makeAuthenticationServiceStub();

    const useCase = new SignUp(
      userRepository,
      encoder,
      authenticationServiceStub
    );

    return {
      useCase,
      userRepository,
      userWithInvalidPassword,
      userWithInvalidEmail,
      validUserWithHashPassword,
    };
  }

  test("Should sign up user with valid data", async () => {
    const { useCase, userRepository, validUserWithHashPassword } = makeSut();

    const response = await useCase.perform(validUser);

    expect(response.value).toHaveProperty("id");
    expect(response.value).toHaveProperty("accessToken");

    const users = await userRepository.findAll();

    expect(users.length).toBe(1);

    const user = await userRepository.findByEmail(validUser.email);

    expect(user?.password).toBe(validUserWithHashPassword.password);
  });

  test("Should not sign up existing user", async () => {
    const { useCase } = makeSut();

    await useCase.perform(validUser);
    const error = await useCase.perform(validUser);

    expect(error.value).toEqual(new ExistingUserError(validUser));
  });

  test("Should not sign up user with invalid password", async () => {
    const { useCase, userWithInvalidPassword } = makeSut();

    const error = await useCase.perform(userWithInvalidPassword);

    expect(error.value).toEqual(
      new InvalidPasswordError(userWithInvalidPassword.password)
    );
  });

  test("Should not sign up user with invalid email", async () => {
    const { useCase, userWithInvalidEmail } = makeSut();

    const error = await useCase.perform(userWithInvalidEmail);

    expect(error.value).toEqual(
      new InvalidEmailError(userWithInvalidEmail.email)
    );
  });
});
