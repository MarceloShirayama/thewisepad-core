import { FakeTokenManager } from "../../../test/doubles/authentication";
import { Middleware } from "../../presentation/middleware/ports";
import { Authentication } from "../../presentation/middleware";

export function makeAuthMiddleware(): Middleware {
  const tokenManager = new FakeTokenManager();

  return new Authentication(tokenManager);
}
