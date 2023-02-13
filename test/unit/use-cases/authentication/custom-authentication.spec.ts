import { CustomAuthentication } from "src/use-cases/authentication";
import { AuthenticationResult } from "src/use-cases/authentication/ports";
import { UserData } from "src/use-cases/ports";
import { UserBuilder } from "test/builders";
import { FakeTokenManager } from "test/doubles/authentication/fake-token-manager";
import { FakeEncoder } from "test/doubles/encoder";
import { InMemoryUserRepository } from "test/doubles/repositories";

describe("Custom authentication", () => {
  const validUser = UserBuilder.createUser().build();
  const userWithWrongPassword = UserBuilder.createUser()
    .withWrongPassword()
    .build();

  async function makeUserRepositoryWithSingleUser() {
    const passwordHash = await new FakeEncoder().encode(validUser.password);

    const userDataArray: UserData[] = [
      {
        email: validUser.email,
        password: passwordHash,
        id: validUser.id,
      },
    ];

    const userRepositoryWithSingleUser = new InMemoryUserRepository(
      userDataArray
    );

    return { userRepositoryWithSingleUser };
  }

  async function makeSut() {
    const { userRepositoryWithSingleUser } =
      await makeUserRepositoryWithSingleUser();

    const encoder = new FakeEncoder();

    const tokenManager = new FakeTokenManager();

    const useCase = new CustomAuthentication(
      userRepositoryWithSingleUser,
      encoder,
      tokenManager
    );

    return { useCase, tokenManager };
  }

  test("Should correctly authenticate if password is correct and user exists", async () => {
    const { useCase, tokenManager } = await makeSut();

    const authentication = await useCase.auth(validUser);

    const response = authentication.value as AuthenticationResult;

    expect(response).toHaveProperty("id", validUser.id);
    expect(response).toHaveProperty("accessToken");

    const verifyToken = (await tokenManager.verify(response.accessToken)).value;

    expect(verifyToken).toEqual({ id: validUser.id });
  });

  test("Should not authenticate if password is incorrect", async () => {
    const { useCase } = await makeSut();

    const authentication = await useCase.auth(userWithWrongPassword);

    const response = authentication.value as Error;

    expect(response.name).toEqual("WrongPasswordError");
  });
});
