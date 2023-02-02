import { MissingParamsError } from "src/presentation/controllers/errors";
import { ok, serverError } from "src/presentation/controllers/util";
import { Authentication } from "src/presentation/middleware";
import { Either } from "src/shared";
import { Payload, TokenManager } from "src/use-cases/authentication/ports";
import { FakeTokenManager } from "test/doubles/authentication";

describe("Authentication middleware", () => {
  it("Should return forbidden if access token is empty", async () => {
    const tokenManager = new FakeTokenManager();
    const authMiddleware = new Authentication(tokenManager);

    const response = await authMiddleware.handle({ accessToken: "" });

    expect(response.body).toEqual(new MissingParamsError("accessToken"));
    expect(response.statusCode).toBe(403);
  });

  it("Should return forbidden if access token is null", async () => {
    const tokenManager = new FakeTokenManager();
    const authMiddleware = new Authentication(tokenManager);

    const response = await authMiddleware.handle({ accessToken: null });

    expect(response.body).toEqual(new MissingParamsError("accessToken"));
  });

  it("Should return forbidden if access token is invalid", async () => {
    const tokenManager = new FakeTokenManager();
    const payload = { id: "my id" };
    const token = await tokenManager.sign(payload);
    const invalidToken = token + "some trash";

    const authMiddleware = new Authentication(tokenManager);

    const response = await authMiddleware.handle({ accessToken: invalidToken });

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual(new Error("Invalid token."));
  });

  it("Should return payload if access token is valid", async () => {
    const tokenManager = new FakeTokenManager();
    const payload = { id: "my id" };
    const token = await tokenManager.sign(payload);

    const authMiddleware = new Authentication(tokenManager);

    const response = await authMiddleware.handle({ accessToken: token });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(payload);
    expect(response).toEqual(ok(payload));
  });

  it("Should return server error if server throws", async () => {
    class ThrowingFakeTokenManager implements TokenManager {
      async sign(info: Payload, expires?: string | undefined): Promise<string> {
        return "any token";
      }
      async verify(token: string): Promise<Either<Error, Payload>> {
        throw new Error("Method not implemented.");
      }
    }

    const payload = { id: "my id" };

    const tokenManager = new ThrowingFakeTokenManager();

    const validToken = await tokenManager.sign(payload);

    const authMiddleware = new Authentication(tokenManager);

    const response = await authMiddleware.handle({ accessToken: validToken });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new Error("Method not implemented."));
    expect(response).toEqual(serverError(new Error("Method not implemented.")));
  });
});
