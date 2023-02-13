import { UseCase } from "../../use-cases/ports";
import { ExistingUserError } from "../../use-cases/sign-up/errors";
import { MissingParamsError } from "./errors";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import {
  badRequest,
  created,
  forbidden,
  getMissingParams,
  serverError,
} from "./util";

export class SignUpController implements Controller {
  readonly requiredParams = ["email", "password"];

  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams = getMissingParams(request, this.requiredParams);

      if (missingParams)
        return badRequest(new MissingParamsError(missingParams));

      const response = await this.useCase.perform({
        email: request.body.email,
        password: request.body.password,
      });

      if (response.isRight()) return created(response.value);

      if (response.isLeft() && response.value instanceof ExistingUserError)
        return forbidden(response.value);

      return badRequest(response.value);
    } catch (error) {
      if (error instanceof Error) return serverError(error);
      console.error("Unexpected error", error);
      return serverError(new Error("Unexpected error"));
    }
  }
}
