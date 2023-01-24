import { describe, expect, test } from "vitest";

import { User } from "@/entities/user";
import { left, right } from "@/shared/either";
import { InvalidEmailError } from "@/entities/errors/invalid-email-error";

describe("User domain entity", () => {
  test("should not create user with invalid e-mail address", () => {
    const invalidEmail = "invalid_email";
    const error = User.create({ email: invalidEmail });
    expect(error).toEqual(left(new InvalidEmailError()));
  });

  test("should create user with valid data", () => {
    const validEmail = "any@mail.com";
    const user = User.create({ email: validEmail }).value as User;
    expect(user.email.value).toEqual(validEmail);
  });
});
