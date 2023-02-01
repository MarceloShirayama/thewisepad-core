import { JwtTokenManager } from "src/external/jwt-token-manager";

describe("Jwt token manager", () => {
  it("Should correctly sign and verify a json web token", async () => {
    const secret = "my secret";

    const tokenManager = new JwtTokenManager(secret);

    const info = { id: "my id" };

    const expires = "10s";

    const signedToken = await tokenManager.sign(info, expires);

    const decoded = await tokenManager.verify(signedToken);

    const response = decoded.value as string | object;

    expect(signedToken).not.toEqual(info);
    expect(response).toHaveProperty("id");
  });
});
