import { describe, expect, test, vi } from "vitest";

import { SignUpController } from "@/presentation/controllers/sign-up";
import { SignUp } from "@/use-cases/sign-up";
import { UserBuilder } from "tests/doubles/builders/user-builder";
import { FakeEncoder } from "tests/doubles/encoder";
import { InMemoryUserRepository } from "tests/doubles/repositories";
import { ExistingUserError } from "@/use-cases/sign-up/errors";
import { InvalidEmailError, InvalidPasswordError } from "@/entities/errors";

describe("Sign up controller", () => {
  function makeSut() {
    const validUser = UserBuilder.createUser().build();
    const userWithInvalidEmail = UserBuilder.createUser()
      .withInvalidEmail()
      .build();
    const userWithInvalidPassword = UserBuilder.createUser()
      .withPasswordWithTooFewChars()
      .build();

    const emptyUserRepository = new InMemoryUserRepository([]);
    const encoder = new FakeEncoder();

    const useCase = new SignUp(emptyUserRepository, encoder);

    const controller = new SignUpController(useCase);

    return {
      controller,
      validUser,
      userWithInvalidEmail,
      userWithInvalidPassword,
      useCase,
    };
  }

  test("Should return 200 and registered user when user is successfully signed up", async () => {
    const { controller, validUser } = makeSut();

    const response = await controller.handle(validUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("password");
    expect(response.body).toHaveProperty("email", validUser.email);
  });

  test("Should return 403 when trying to sign up existing user", async () => {
    const { controller, validUser } = makeSut();

    await controller.handle(validUser);

    const response = await controller.handle(validUser);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeInstanceOf(ExistingUserError);
  });

  test("Should return 400 when trying to sign up user with invalid email", async () => {
    const { controller, userWithInvalidEmail } = makeSut();

    const response = await controller.handle(userWithInvalidEmail);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(InvalidEmailError);
  });

  test("Should return 400 when trying to sign up user with invalid password", async () => {
    const { controller, userWithInvalidPassword } = makeSut();

    const response = await controller.handle(userWithInvalidPassword);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(InvalidPasswordError);
  });

  test("Should return 500 if an error is raised internally", async () => {
    const { useCase, validUser } = makeSut();

    SignUp.prototype.perform = vi.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    const controller = new SignUpController(useCase);

    const response = await controller.handle(validUser);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeInstanceOf(Error);
  });
});
