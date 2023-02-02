import { FakeTokenManager } from "../../../test/doubles/authentication";
import { Middleware } from "../../presentation/middleware/ports";
import { AuthMiddleware } from "../../presentation/middleware";

export function makeAuthMiddleware(): Middleware {
  const tokenManager = new FakeTokenManager();

  return new AuthMiddleware(tokenManager);
}
