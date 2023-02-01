import { Either, left, right } from "src/shared";
import { Payload, TokenManager } from "src/use-cases/authentication/ports";

export class FakeTokenManager implements TokenManager {
  async sign(info: Payload): Promise<string> {
    return `${info.id}-TOKEN`;
  }
  async verify(token: string): Promise<Either<Error, string | object>> {
    return token.endsWith("-TOKEN")
      ? right(token.substring(0, token.indexOf("-TOKEN")))
      : left(new Error("Invalid token."));
  }
}
