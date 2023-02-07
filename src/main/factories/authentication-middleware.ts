import { FakeTokenManager } from "../../../test/doubles/authentication";
import { Middleware } from "../../presentation/middleware/ports";
import { Authentication } from "../../presentation/middleware";
import { JwtTokenManager } from "src/external/token-manager";
import { env } from "../config/environment";

export function makeAuthMiddleware(): Middleware {
  const tokenManager = new JwtTokenManager(env.JWT_SECRET);

  return new Authentication(tokenManager);
}
