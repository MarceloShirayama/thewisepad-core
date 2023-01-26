import { describe, expect, test } from "vitest";

import { UserData } from "@/use-cases/ports";
import { InMemoryUserRepository } from "tests/doubles/repositories";
import { SignIn } from "@/use-cases/sign-in";
import { FakeEncoder } from "tests/doubles/encoder";
import { UserBuilder } from "tests/doubles/builders/user-builder";

describe("SigIn use case", () => {
  const validUserSignInRequest: UserData = UserBuilder.createUser().build();

  const signInRequestWithWrongPassword: UserData = UserBuilder.createUser()
    .withWrongPassword()
    .build();

  const signInRequestWithUnregisteredUser: UserData = UserBuilder.createUser()
    .withDifferentEmail()
    .build();

  const userDataArrayWithSingleUser: UserData[] = [
    {
      email: validUserSignInRequest.email,
      password: `${validUserSignInRequest.password}-ENCRYPTED`,
    },
  ];

  const singleUserUserRepository = new InMemoryUserRepository(
    userDataArrayWithSingleUser
  );

  const encoder = new FakeEncoder();

  test("Should correctly signIn if password is correct", async () => {
    const useCase = new SignIn(singleUserUserRepository, encoder);

    const response = await useCase.perform(validUserSignInRequest);

    const user = response.value;

    expect(user).toBe(validUserSignInRequest);
  });

  test("Should not signIn if password is incorrect", async () => {
    const useCase = new SignIn(singleUserUserRepository, encoder);

    const response = await useCase.perform(signInRequestWithWrongPassword);

    const error = response.value as Error;

    expect(error.name).toBe("WrongPasswordError");
  });

  test("Should not sig in with unregistered user", async () => {
    const useCase = new SignIn(singleUserUserRepository, encoder);

    const response = await useCase.perform(signInRequestWithUnregisteredUser);

    const error = response.value as Error;

    expect(error.name).toBe("UserNotFoundError");
  });
});
