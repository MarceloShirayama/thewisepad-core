import { Authentication } from "../../presentation/middleware";
import { Middleware } from "../../presentation/middleware/ports";
import { makeTokenManager } from ".";

export function makeAuthMiddleware(): Middleware {
  const tokenManager = makeTokenManager();

  return new Authentication(tokenManager);
}
