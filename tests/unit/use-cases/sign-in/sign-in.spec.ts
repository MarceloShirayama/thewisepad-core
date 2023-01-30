import { describe, expect, test } from "vitest";

import { UserData } from "src/use-cases/ports";
import { SignIn } from "src/use-cases/sign-in";
import { UserBuilder } from "tests/doubles/builders/user-builder";
import { FakeEncoder } from "tests/doubles/encoder";
import { InMemoryUserRepository } from "tests/doubles/repositories";

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
    const useCase = new SignIn(singleUserUserRepository, encoder);

    return {
      useCase,
      encoder,
      validUser,
      userWithWrongPassword,
      userWithUnregistered,
    };
  }

  test("Should correctly signIn if password is correct", async () => {
    const { useCase, validUser } = makeSut();

    const response = await useCase.perform(validUser);

    const user = response.value;

    expect(user).toBe(validUser);
  });

  test("Should not signIn if password is incorrect", async () => {
    const { useCase, userWithWrongPassword } = makeSut();

    const response = await useCase.perform(userWithWrongPassword);

    const error = response.value as Error;

    expect(error.name).toBe("WrongPasswordError");
  });

  test("Should not sig in with unregistered user", async () => {
    const { useCase, userWithUnregistered } = makeSut();

    const response = await useCase.perform(userWithUnregistered);

    const error = response.value as Error;

    expect(error.name).toBe("UserNotFoundError");
  });
});
