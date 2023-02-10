import { HttpResponse } from "src/presentation/controllers/ports";
import { Payload, TokenManager } from "../../use-cases/authentication/ports";
import { forbidden, ok, serverError } from "../controllers/util";
import { Middleware } from "./ports";

export type AuthRequest = {
  accessToken: string | null;
  requesterId: string;
};

export class Authentication implements Middleware {
  constructor(private readonly tokenManager: TokenManager) {}

  async handle(httpRequest: AuthRequest): Promise<HttpResponse> {
    try {
      const { accessToken, requesterId } = httpRequest;

      if (!accessToken || !requesterId)
        return forbidden(new Error("Invalid token or requester id."));

      const decodedTokenOrError = await this.tokenManager.verify(accessToken);

      if (decodedTokenOrError.isLeft())
        return forbidden(decodedTokenOrError.value);

      const payload = decodedTokenOrError.value as Payload;

      if (payload.id === requesterId) return ok(payload);

      return forbidden(
        new Error("User not allowed to perform this operation.")
      );
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
