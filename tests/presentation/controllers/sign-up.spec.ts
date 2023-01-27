import { describe, expect, test } from "vitest";

import { InvalidEmailError, InvalidPasswordError } from "@/entities/errors";
import { HttpRequest } from "@/presentation/controllers/ports";
import { SignUpController } from "@/presentation/controllers/sign-up";
import { SignUp } from "@/use-cases/sign-up";
import { ExistingUserError } from "@/use-cases/sign-up/errors";
import { UserBuilder } from "tests/doubles/builders/user-builder";
import { FakeEncoder } from "tests/doubles/encoder";
import { InMemoryUserRepository } from "tests/doubles/repositories";
import { UseCase } from "@/use-cases/ports";

describe("Sign up controller", () => {
  function makeSut() {
    const validUser = UserBuilder.createUser().build();

    const validUserRequest: HttpRequest = {
      body: {
        email: validUser.email,
        password: validUser.password,
      },
    };

    const userWithInvalidEmail = UserBuilder.createUser()
      .withInvalidEmail()
      .build();

    const userWithInvalidEmailRequest: HttpRequest = {
      body: {
        email: userWithInvalidEmail.email,
        password: userWithInvalidEmail.password,
      },
    };

    const userWithInvalidPassword = UserBuilder.createUser()
      .withPasswordWithTooFewChars()
      .build();

    const userWithInvalidPasswordRequest: HttpRequest = {
      body: {
        email: userWithInvalidPassword.email,
        password: userWithInvalidPassword.password,
      },
    };

    const emptyUserRepository = new InMemoryUserRepository([]);
    const encoder = new FakeEncoder();

    const useCase = new SignUp(emptyUserRepository, encoder);

    const controller = new SignUpController(useCase);

    class ErrorThrowingSingUpUseCaseStub implements UseCase {
      async perform(request: any): Promise<void> {
        throw Error();
      }
    }

    const errorThrowingSingUpUseCaseStub = new ErrorThrowingSingUpUseCaseStub();

    const controllerWithStubUseCaseWithError = new SignUpController(
      errorThrowingSingUpUseCaseStub
    );

    return {
      controller,
      useCase,
      validUserRequest,
      userWithInvalidPasswordRequest,
      userWithInvalidEmailRequest,
      controllerWithStubUseCaseWithError,
    };
  }

  test("Should return 201 and registered user when user is successfully signed up", async () => {
    const { controller, validUserRequest } = makeSut();

    const response = await controller.handle(validUserRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("password");
    expect(response.body).toHaveProperty("email", validUserRequest.body.email);
  });

  test("Should return 403 when trying to sign up existing user", async () => {
    const { controller, validUserRequest } = makeSut();

    await controller.handle(validUserRequest);

    const response = await controller.handle(validUserRequest);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeInstanceOf(ExistingUserError);
  });

  test("Should return 400 when trying to sign up user with invalid email", async () => {
    const { controller, userWithInvalidEmailRequest } = makeSut();

    const response = await controller.handle(userWithInvalidEmailRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(InvalidEmailError);
  });

  test("Should return 400 when trying to sign up user with invalid password", async () => {
    const { controller, userWithInvalidPasswordRequest } = makeSut();

    const response = await controller.handle(userWithInvalidPasswordRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(InvalidPasswordError);
  });

  test("Should return 500 if an error is raised internally", async () => {
    const { validUserRequest, controllerWithStubUseCaseWithError } = makeSut();

    const response = await controllerWithStubUseCaseWithError.handle(
      validUserRequest
    );

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeInstanceOf(Error);
  });
});
