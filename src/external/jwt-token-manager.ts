import {
  sign,
  TokenExpiredError,
  verify,
  JsonWebTokenError,
} from "jsonwebtoken";

import { Either, left, right } from "../shared";
import { Payload, TokenManager } from "../use-cases/authentication/ports";

export class JwtTokenManager implements TokenManager {
  constructor(private readonly secret: string) {}

  async sign(info: Payload, expires?: string): Promise<string> {
    return expires
      ? sign(info, this.secret, { expiresIn: expires })
      : sign(info, this.secret);
  }
  async verify(
    token: string
  ): Promise<Either<TokenExpiredError | JsonWebTokenError, string | object>> {
    try {
      const decoded = verify(token, this.secret);

      return right(decoded);
    } catch (error: any) {
      return left(error as TokenExpiredError | JsonWebTokenError);
    }
  }
}
