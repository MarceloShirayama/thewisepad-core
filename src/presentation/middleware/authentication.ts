import { HttpResponse } from "src/presentation/controllers/ports";
import { Payload, TokenManager } from "../../use-cases/authentication/ports";
import { MissingParamsError } from "../controllers/errors";
import { forbidden, ok, serverError } from "../controllers/util";
import { Middleware } from "./ports";

export type AuthRequest = {
  accessToken: string;
};

export class AuthMiddleware implements Middleware {
  constructor(private readonly tokenManager: TokenManager) {}

  async handle(httpRequest: AuthRequest): Promise<HttpResponse> {
    try {
      const { accessToken } = httpRequest;

      if (!accessToken) return forbidden(new MissingParamsError("accessToken"));

      const decodedTokenOrError = await this.tokenManager.verify(accessToken);

      if (decodedTokenOrError.isLeft())
        return forbidden(decodedTokenOrError.value);

      return ok({ id: (decodedTokenOrError.value as Payload).id });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

// export const authMiddleware = adaptMiddleware(makeAuthMiddleware());