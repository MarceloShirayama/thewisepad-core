import { describe, expect, test } from "vitest";

import { User } from "src/entities";
import { InvalidEmailError, InvalidPasswordError } from "src/entities/errors";
import { left } from "src/shared";

describe("User domain entity", () => {
  const validEmail = "any@mail.com";
  const invalidEmail = "invalid_email";
  const validPassword = "1valid_password";
  const invalidPassword = "invalid_password";

  test("should not create user with invalid e-mail address", () => {
    const error = User.create({ email: invalidEmail, password: validPassword });

    expect(error).toEqual(left(new InvalidEmailError(invalidEmail)));
  });

  test("should create user with valid data", () => {
    const user = User.create({ email: validEmail, password: validPassword })
      .value as User;

    expect(user.email.value).toEqual(validEmail);
  });

  test("should not create user with invalid password (no numbers)", () => {
    const error = User.create({ email: validEmail, password: invalidPassword });

    expect(error).toEqual(left(new InvalidPasswordError(invalidPassword)));
  });
});
