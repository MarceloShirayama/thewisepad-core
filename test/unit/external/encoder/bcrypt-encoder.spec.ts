import { BcryptEncoder } from "src/external/encoder";

describe("Bcrypt encoder", () => {
  test("Should correctly encode and decode string", async () => {
    const encoder = new BcryptEncoder();

    const password = "my password";

    const encodedPassword = await encoder.encode(password);

    const isEqual = await encoder.compare(password, encodedPassword);

    expect(password).not.toBe(encodedPassword);
    expect(isEqual).toBeTruthy();
  });
});
