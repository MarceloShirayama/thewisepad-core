import { Either } from "../../shared";
import {
  UserNotFoundError,
  WrongPasswordError,
} from "../../use-cases/authentication/errors";
import { AuthenticationResult } from "../../use-cases/authentication/ports";
import { UseCase } from "../../use-cases/ports";
import { MissingParamsError } from "./errors";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import {
  badRequest,
  forbidden,
  getMissingParams,
  ok,
  serverError,
} from "./util";

export class SignInController implements Controller {
  readonly requiredParams = ["email", "password"];

  constructor(private readonly signInUseCase: UseCase) {}

  async specificOp(request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams = getMissingParams(request, this.requiredParams);

      if (missingParams)
        return badRequest(new MissingParamsError(missingParams));

      const response: Either<
        UserNotFoundError | WrongPasswordError,
        AuthenticationResult
      > = await this.signInUseCase.perform({
        email: request.body.email,
        password: request.body.password,
      });

      if (response.value instanceof WrongPasswordError)
        return forbidden(response.value);

      if (response.isRight()) return ok(response.value);

      return forbidden(response.value);
    } catch (error) {
      if (error instanceof Error) return serverError(error);
      console.error("Unexpected error", error);
      return serverError(new Error("Unexpected error"));
    }
  }
}
