import { describe, expect, test } from "vitest";

import { SignUpController } from "@/presentation/controllers/sign-up";
import { SignUp } from "@/use-cases/sign-up";
import { UserBuilder } from "tests/doubles/builders/user-builder";
import { FakeEncoder } from "tests/doubles/encoder";
import { InMemoryUserRepository } from "tests/doubles/repositories";

describe("Sign up controller", () => {
  function makeSut() {
    const validUser = UserBuilder.createUser().build();

    const emptyUserRepository = new InMemoryUserRepository([]);
    const encoder = new FakeEncoder();

    const useCase = new SignUp(emptyUserRepository, encoder);

    const controller = new SignUpController(useCase);

    return { controller, validUser };
  }

  test("Should return 200 and registered user when user is successfully signed up", async () => {
    const { controller, validUser } = makeSut();

    const response = await controller.handle(validUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("password");
    expect(response.body).toHaveProperty("email", validUser.email);
  });

  test("Should return 403 when trying to sign up existing user", async () => {
    const { controller, validUser } = makeSut();

    await controller.handle(validUser);

    const response = await controller.handle(validUser);

    expect(response.statusCode).toBe(403);
  });
});
