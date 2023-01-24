import { describe, expect, test } from "vitest";

import { InvalidEmailError } from "@/entities/errors/invalid-email-error";
import { User } from "@/entities/user";
import { left } from "@/shared/either";
import { InvalidPasswordError } from "@/entities/errors/invalid-password-error";

describe("User domain entity", () => {
  test("should not create user with invalid e-mail address", () => {
    const invalidEmail = "invalid_email";
    const validPassword = "1valid_password";
    const error = User.create({ email: invalidEmail, password: validPassword });

    expect(error).toEqual(left(new InvalidEmailError(invalidEmail)));
  });

  test("should create user with valid data", () => {
    const validEmail = "any@mail.com";
    const validPassword = "1valid_password";
    const user = User.create({ email: validEmail, password: validPassword })
      .value as User;
    expect(user.email.value).toEqual(validEmail);
  });

  test("should not create user with invalid password (no numbers)", () => {
    const validEmail = "any@mail.com";
    const invalidPassword = "invalid_password";

    const error = User.create({ email: validEmail, password: invalidPassword });

    expect(error).toEqual(left(new InvalidPasswordError(invalidPassword)));
  });
});
