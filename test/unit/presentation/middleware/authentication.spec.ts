import { MissingParamsError } from "src/presentation/controllers/errors";
import { forbidden, ok, serverError } from "src/presentation/controllers/util";
import { Authentication } from "src/presentation/middleware";
import { Either } from "src/shared";
import { Payload, TokenManager } from "src/use-cases/authentication/ports";
import { FakeTokenManager } from "test/doubles/authentication";

describe("Authentication middleware", () => {
  it("Should return forbidden with invalid token error if access token is empty", async () => {
    const tokenManager = new FakeTokenManager();
    const authMiddleware = new Authentication(tokenManager);

    const response = await authMiddleware.handle({
      accessToken: "",
      requesterId: "",
    });

    expect(response.body).toEqual(new Error("Invalid token or requester id."));
    expect(response.statusCode).toBe(403);
  });

  it("Should return forbidden with invalid token error  if access token is null", async () => {
    const tokenManager = new FakeTokenManager();
    const authMiddleware = new Authentication(tokenManager);

    const response = await authMiddleware.handle({
      accessToken: null,
      requesterId: "0",
    });

    expect(response.body).toEqual(new Error("Invalid token or requester id."));
  });

  it("Should return forbidden with invalid token error  if access token is invalid", async () => {
    const tokenManager = new FakeTokenManager();
    const payload = { id: "my id" };
    const token = await tokenManager.sign(payload);
    const invalidToken = token + "some trash";

    const authMiddleware = new Authentication(tokenManager);

    const response = await authMiddleware.handle({
      accessToken: invalidToken,
      requesterId: "",
    });

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual(new Error("Invalid token or requester id."));
  });

  it("Should return payload if access token is valid", async () => {
    const tokenManager = new FakeTokenManager();
    const payload = { id: "0" };
    const token = await tokenManager.sign(payload);

    const authMiddleware = new Authentication(tokenManager);

    const response = await authMiddleware.handle({
      accessToken: token,
      requesterId: "0",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(payload);
    expect(response).toEqual(ok(payload));
  });

  it("Should return forbidden if id on access token is different from requester id", async () => {
    const tokenManager = new FakeTokenManager();
    const payload = { id: "my id" };
    const token = await tokenManager.sign(payload);

    const authMiddleware = new Authentication(tokenManager);

    const response = await authMiddleware.handle({
      accessToken: token,
      requesterId: "other id",
    });

    const error = response.body as Error;

    expect(response).toEqual(
      forbidden(new Error("User not allowed to perform this operation."))
    );
    expect(error.message).toBe("User not allowed to perform this operation.");
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

    const payload = { id: "0" };

    const tokenManager = new ThrowingFakeTokenManager();

    const validToken = await tokenManager.sign(payload);

    const authMiddleware = new Authentication(tokenManager);

    const response = await authMiddleware.handle({
      accessToken: validToken,
      requesterId: "0",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new Error("Method not implemented."));
    expect(response).toEqual(serverError(new Error("Method not implemented.")));
  });
});
