import { Either, left, right } from "src/shared";
import { TokenManager } from "src/use-cases/authentication/ports";

export class FakeTokenManager implements TokenManager {
  async sign(info: string): Promise<string> {
    return `${info}-TOKEN`;
  }
  async verify(token: string): Promise<Either<Error, string>> {
    return token.endsWith("-TOKEN")
      ? right(token.substring(0, token.indexOf("-TOKEN")))
      : left(new Error("Invalid token."));
  }
}
