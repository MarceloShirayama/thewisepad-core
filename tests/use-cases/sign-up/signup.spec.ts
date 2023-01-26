import { describe, expect, test } from "vitest";

import { InvalidEmailError, InvalidPasswordError } from "@/entities/errors";
import { UserData } from "@/use-cases/ports";
import { SignUp } from "@/use-cases/sign-up";
import { ExistingUserError } from "@/use-cases/sign-up/errors";
import { FakeEncoder } from "tests/doubles/encoder";
import { InMemoryUserRepository } from "tests/doubles/repositories";
import { UserBuilder } from "tests/doubles/builders/user-builder";

describe("SignUp use case", () => {
  const makeSut = () => {
    const validUser: UserData = UserBuilder.createUser().build();

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

    const useCase = new SignUp(userRepository, encoder);

    return {
      useCase,
      userRepository,
      validUser,
      userWithInvalidPassword,
      userWithInvalidEmail,
      validUserWithHashPassword,
    };
  };

  test("Should sign up user with valid data", async () => {
    const { useCase, userRepository, validUser, validUserWithHashPassword } =
      makeSut();

    const response = await useCase.perform(validUser);

    expect(response.value).toHaveProperty("id");
    expect(response.value).toHaveProperty("email", validUser.email);
    expect(response.value).toHaveProperty(
      "password",
      `${validUser.password}-ENCRYPTED`
    );

    const users = await userRepository.findAll();

    expect(users.length).toBe(1);

    const user = await userRepository.findByEmail(validUser.email);

    expect(user?.password).toBe(validUserWithHashPassword.password);
  });

  test("Should not sign up existing user", async () => {
    const { useCase, validUser } = makeSut();

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
