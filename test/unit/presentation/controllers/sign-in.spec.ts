import { SignInController } from "src/presentation/controllers";
import { CustomAuthentication } from "src/use-cases/authentication";
import { AuthenticationResult } from "src/use-cases/authentication/ports";
import { SignIn } from "src/use-cases/sign-in";
import { UserBuilder } from "test/builders/user-builder";
import { FakeTokenManager } from "test/doubles/authentication";
import { FakeEncoder } from "test/doubles/encoder";
import { InMemoryUserRepository } from "test/doubles/repositories";

describe("Sign in controller", () => {
  it("Should return 200 if valid credentials are provided", async () => {
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

    const validSignInRequest = {
      body: { email: validUser.email, password: validUser.password },
    };

    const controller = new SignInController(signInUseCase);

    const response = await controller.handle(validSignInRequest);

    const authResult = response.body as AuthenticationResult;

    expect(response.statusCode).toBe(200);
    expect(authResult.id).toBe(validUser.id);
    expect(authResult).toHaveProperty("accessToken");
  });
});
