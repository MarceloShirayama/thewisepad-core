import { HttpResponse } from "src/presentation/controllers/ports";
import { Payload, TokenManager } from "../../use-cases/authentication/ports";
import { forbidden, ok, serverError } from "../controllers/util";
import { Middleware } from "./ports";

export type AuthRequest = {
  accessToken: string | null;
};

export class Authentication implements Middleware {
  constructor(private readonly tokenManager: TokenManager) {}

  async handle(httpRequest: AuthRequest): Promise<HttpResponse> {
    try {
      const { accessToken } = httpRequest;

      if (!accessToken) return forbidden(new Error("Invalid token."));

      const decodedTokenOrError = await this.tokenManager.verify(accessToken);

      if (decodedTokenOrError.isLeft())
        return forbidden(decodedTokenOrError.value);

      const payload = decodedTokenOrError.value as Payload;

      return ok(payload);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

// export const authMiddleware = adaptMiddleware(makeAuthMiddleware());
