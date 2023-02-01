import { sign, verify } from "jsonwebtoken";

import { Either, left, right } from "../shared";
import { Payload, TokenManager } from "../use-cases/authentication/ports";

export class JwtTokenManager implements TokenManager {
  constructor(private readonly secret: string) {}

  async sign(info: Payload): Promise<string> {
    const signIn = sign(info, this.secret);

    return signIn;
  }
  async verify(token: string): Promise<Either<Error, string | object>> {
    try {
      const decoded = verify(token, this.secret);

      return right(decoded);
    } catch (error: any) {
      return left(error as Error);
    }
  }
}
