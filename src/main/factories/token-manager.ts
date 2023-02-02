import { TokenManager } from "../../use-cases/authentication/ports";
import { JwtTokenManager } from "../../external/jwt-token-manager";

export function makeTokenManager(): TokenManager {
  return new JwtTokenManager(String(process.env.JWT_SECRET));
}
