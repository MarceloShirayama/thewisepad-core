import { describe, expect, test } from "vitest";

import { CustomAuthentication } from "src/use-cases/authentication";
import { AuthenticationResult } from "src/use-cases/authentication/ports";
import { UserData } from "src/use-cases/ports";
import { SignIn } from "src/use-cases/sign-in";
import { UserBuilder } from "test/builders/user-builder";
import { FakeTokenManager } from "test/doubles/authentication/fake-token-manager";
import { FakeEncoder } from "test/doubles/encoder";
import { InMemoryUserRepository } from "test/doubles/repositories";

describe("SigIn use case", () => {
  function makeSut() {
    const validUser = UserBuilder.createUser().build();
    const validUserWithHashPassword = UserBuilder.createUser()
      .withHashPassword()
      .build();
    const userWithWrongPassword: UserData = UserBuilder.createUser()
      .withWrongPassword()
      .build();
    const userWithUnregistered: UserData = UserBuilder.createUser()
      .withDifferentEmail()
      .build();
    const userDataArrayWithSingleUser = [validUserWithHashPassword];
    const singleUserUserRepository = new InMemoryUserRepository(
      userDataArrayWithSingleUser
    );
    const encoder = new FakeEncoder();
    const tokenManager = new FakeTokenManager();
    const authenticationService = new CustomAuthentication(
      singleUserUserRepository,
      encoder,
      tokenManager
    );

    return {
      authenticationService,
      validUser,
      userWithWrongPassword,
      userWithUnregistered,
    };
  }

  test("Should correctly signIn if password is correct", async () => {
    const { authenticationService, validUser } = makeSut();

    const useCase = new SignIn(authenticationService);

    const authentication = await useCase.perform(validUser);

    const authenticationResult = authentication.value as AuthenticationResult;

    expect(authenticationResult).toHaveProperty("id");
    expect(authenticationResult).toHaveProperty("accessToken");
  });

  test("Should not signIn if password is incorrect", async () => {
    const { authenticationService, userWithWrongPassword } = makeSut();

    const useCase = new SignIn(authenticationService);

    const authentication = await useCase.perform(userWithWrongPassword);

    const error = authentication.value as Error;

    expect(error.name).toBe("WrongPasswordError");
  });

  test("Should not sig in with unregistered user", async () => {
    const { authenticationService, userWithUnregistered } = makeSut();

    const useCase = new SignIn(authenticationService);

    const authentication = await useCase.perform(userWithUnregistered);

    const error = authentication.value as Error;

    expect(error.name).toBe("UserNotFoundError");
  });
});
