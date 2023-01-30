import { describe, expect, test } from "vitest";

import { Password } from "src/entities";

describe("Password validation", () => {
  test("Should not accept empty strings", () => {
    const invalidPassword = "";

    expect(Password.validate(invalidPassword)).toBeFalsy();
  });

  test("Should not accept strings (too few chars)", () => {
    const invalidPassword = "12abc";

    expect(Password.validate(invalidPassword)).toBeFalsy();
  });

  test("Should not accept strings without numbers", () => {
    const invalidPassword = "invalid_password";

    expect(Password.validate(invalidPassword)).toBeFalsy();
  });

  test("Should accept valid password", () => {
    const invalidPassword = "1valid_password";

    expect(Password.validate(invalidPassword)).toBeTruthy();
  });
});
