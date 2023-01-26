import { describe, expect, test } from "vitest";

import { UserData } from "@/use-cases/ports";
import { InMemoryUserRepository } from "tests/doubles/repositories";
import { SignIn } from "@/use-cases/sign-in";
import { FakeEncoder } from "tests/doubles/encoder";

describe("SigIn use case", () => {
  const validEmail = "any@mail.com";

  const validPassword = "1valid_password";
  const wrongPassword = "wrong_password";

  const validUserSignInRequest: UserData = {
    email: validEmail,
    password: validPassword,
  };

  const invalidUserSignInRequest: UserData = {
    email: validEmail,
    password: wrongPassword,
  };

  const userDataArrayWithSingleUser: UserData[] = [
    {
      email: validEmail,
      password: `${validPassword}-ENCRYPTED`,
    },
  ];

  const singleUserUserRepository = new InMemoryUserRepository(
    userDataArrayWithSingleUser
  );

  const encoder = new FakeEncoder();

  test("Should correctly signIn if password is correct", async () => {
    const useCase = new SignIn(singleUserUserRepository, encoder);

    const userResponse = await useCase.perform(validUserSignInRequest);

    const user = userResponse.value;

    expect(user).toBe(validUserSignInRequest);
  });

  test("Should not signIn if password is incorrect", async () => {
    const useCase = new SignIn(singleUserUserRepository, encoder);

    const userResponse = await useCase.perform(invalidUserSignInRequest);

    const error = userResponse.value as Error;

    expect(error.name).toBe("WrongPasswordError");
  });
});
