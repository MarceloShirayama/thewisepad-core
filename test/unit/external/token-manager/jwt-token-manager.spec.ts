import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import sinon from "sinon";

import { JwtTokenManager } from "src/external/jwt-token-manager";

describe("Jwt token manager", () => {
  it("Should correctly sign and verify a json web token", async () => {
    const secret = "my secret";

    const tokenManager = new JwtTokenManager(secret);

    const info = { id: "my id" };

    const expires = "1h";

    const signedToken = await tokenManager.sign(info, expires);

    const decoded = await tokenManager.verify(signedToken);

    const response = decoded.value as string | object;

    expect(signedToken).not.toEqual(info);
    expect(response).toHaveProperty("id");
  });

  it("Should correctly verify invalid json web token", async () => {
    const secret = "my secret";

    const tokenManager = new JwtTokenManager(secret);

    const info = { id: "my id" };

    const expires = "1h";

    const signedToken = await tokenManager.sign(info, expires);

    const invalidToken = signedToken + "some trash";

    const decoded = await tokenManager.verify(invalidToken);

    const error = decoded.value as Error;

    expect(error.message).toBe("invalid token");
    expect(error).toBeInstanceOf(JsonWebTokenError);
  });

  it("Should correctly verify expired json web token", async () => {
    const clock = sinon.useFakeTimers();

    const secret = "my secret";

    const tokenManager = new JwtTokenManager(secret);

    const info = { id: "my id" };

    const expires = "1h";

    const signedToken = await tokenManager.sign(info, expires);

    clock.tick(3600100);

    const decoded = await tokenManager.verify(signedToken);

    const error = decoded.value as Error;

    expect(error.message).toBe("jwt expired");
    expect(error).toBeInstanceOf(TokenExpiredError);
  });
});
