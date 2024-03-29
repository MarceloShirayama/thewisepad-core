import { InvalidEmailError, InvalidPasswordError } from "src/entities/errors";
import { SignUpController } from "src/presentation/controllers";
import { HttpRequest } from "src/presentation/controllers/ports";
import { SignUp } from "src/use-cases/sign-up";
import { ExistingUserError } from "src/use-cases/sign-up/errors";
import { UserBuilder } from "test/builders";
import { makeAuthenticationServiceStub } from "test/doubles/authentication";
import { FakeEncoder } from "test/doubles/encoder";
import { InMemoryUserRepository } from "test/doubles/repositories";
import { makeErrorThrowingUseCaseStub } from "test/doubles/use-cases";

describe("Sign up controller", () => {
  const validUser = UserBuilder.createUser().build();

  function makeSut() {
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

    const { authenticationServiceStub } = makeAuthenticationServiceStub();

    const useCase = new SignUp(
      emptyUserRepository,
      encoder,
      authenticationServiceStub
    );

    const controller = new SignUpController(useCase);

    const errorThrowingSingUpUseCaseStub = makeErrorThrowingUseCaseStub();

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

  test("Should return 201 and authentication result when user is successfully signed up", async () => {
    const { controller, validUserRequest } = makeSut();

    const response = await controller.specificOp(validUserRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id", validUser.id);
    expect(response.body).toHaveProperty("accessToken");
  });

  test("Should return 403 when trying to sign up existing user", async () => {
    const { controller, validUserRequest } = makeSut();

    await controller.specificOp(validUserRequest);

    const response = await controller.specificOp(validUserRequest);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBeInstanceOf(ExistingUserError);
  });

  test("Should return 400 when trying to sign up user with invalid email", async () => {
    const { controller, userWithInvalidEmailRequest } = makeSut();

    const response = await controller.specificOp(userWithInvalidEmailRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(InvalidEmailError);
  });

  test("Should return 400 when trying to sign up user with invalid password", async () => {
    const { controller, userWithInvalidPasswordRequest } = makeSut();

    const response = await controller.specificOp(
      userWithInvalidPasswordRequest
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(InvalidPasswordError);
  });

  test("Should return 400 when trying to sign up user with missing email", async () => {
    const { controller } = makeSut();

    const userWithMissingEmail = {
      body: { password: validUser.password },
    };

    const response = await controller.specificOp(userWithMissingEmail);

    expect(response.statusCode).toBe(400);
    expect((response.body as Error).message).toBe("Missing param: email.");
  });

  test("Should return 400 when trying to sign up user with missing password", async () => {
    const { controller } = makeSut();

    const userWithMissingPassword = {
      body: { email: validUser.email },
    };

    const response = await controller.specificOp(userWithMissingPassword);

    expect(response.statusCode).toBe(400);
    expect((response.body as Error).message).toBe("Missing param: password.");
  });

  test("Should return 400 when trying to sign up user with missing email and password", async () => {
    const { controller } = makeSut();

    const userWithMissingEmailAndPassword = { body: {} };

    const response = await controller.specificOp(
      userWithMissingEmailAndPassword
    );

    expect(response.statusCode).toBe(400);
    expect((response.body as Error).message).toBe(
      "Missing param: email, password."
    );
  });

  test("Should return 500 if an error is raised internally", async () => {
    const { validUserRequest, controllerWithStubUseCaseWithError } = makeSut();

    const response = await controllerWithStubUseCaseWithError.specificOp(
      validUserRequest
    );

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeInstanceOf(Error);
  });
});
