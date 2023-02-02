import { SignInController } from "src/presentation/controllers";
import { MissingParamsError } from "src/presentation/controllers/errors";
import { CustomAuthentication } from "src/use-cases/authentication";
import { AuthenticationResult } from "src/use-cases/authentication/ports";
import { SignIn } from "src/use-cases/sign-in";
import { UserBuilder } from "test/builders/user-builder";
import { FakeTokenManager } from "test/doubles/authentication";
import { FakeEncoder } from "test/doubles/encoder";
import { InMemoryUserRepository } from "test/doubles/repositories";

describe("Sign in controller", () => {
  async function makeSut() {
    const validUser = UserBuilder.createUser().build();

    const encoder = new FakeEncoder();

    const userDataWithSingleUser = [
      {
        email: validUser.email,
        password: await encoder.encode(validUser.password),
        id: String(validUser.id),
      },
    ];

    const userRepository = new InMemoryUserRepository(userDataWithSingleUser);

    const tokenManager = new FakeTokenManager();

    const authentication = new CustomAuthentication(
      userRepository,
      encoder,
      tokenManager
    );

    const signInUseCase = new SignIn(authentication);

    const controller = new SignInController(signInUseCase);

    return { controller, validUser };
  }

  it("Should return 200 if valid credentials are provided", async () => {
    const { controller, validUser } = await makeSut();

    const validSignInRequest = {
      body: { email: validUser.email, password: validUser.password },
    };

    const response = await controller.handle(validSignInRequest);

    const authResult = response.body as AuthenticationResult;

    expect(response.statusCode).toBe(200);
    expect(authResult.id).toBe(validUser.id);
    expect(authResult).toHaveProperty("accessToken");
  });

  it("Should return 400 if email is missing in the request", async () => {
    const { controller, validUser } = await makeSut();

    const SignInRequestWithoutPassword = {
      body: { password: validUser.password },
    };

    const response = await controller.handle(SignInRequestWithoutPassword);

    const error = response.body as Error;

    expect(response.statusCode).toBe(400);
    expect(error.message).toBe("Missing param: email.");
    expect(error).toBeInstanceOf(MissingParamsError);
  });

  it("Should return 400 if password is missing in the request", async () => {
    const { controller, validUser } = await makeSut();

    const SignInRequestWithoutEmail = {
      body: { email: validUser.email },
    };

    const response = await controller.handle(SignInRequestWithoutEmail);

    const error = response.body as Error;

    expect(response.statusCode).toBe(400);
    expect(error.message).toBe("Missing param: password.");
    expect(error).toBeInstanceOf(MissingParamsError);
  });

  it("Should return 400 if email and password is missing in the request", async () => {
    const { controller } = await makeSut();

    const SignInRequestWithoutEmailAndPassword = {
      body: {},
    };

    const response = await controller.handle(
      SignInRequestWithoutEmailAndPassword
    );

    const error = response.body as Error;

    expect(response.statusCode).toBe(400);
    expect(error.message).toBe("Missing param: email password.");
    expect(error).toBeInstanceOf(MissingParamsError);
  });
});
