import { Either, left } from "src/shared";
import {
  UserNotFoundError,
  WrongPasswordError,
} from "src/use-cases/authentication/errors";
import { AuthenticationResult } from "src/use-cases/authentication/ports";
import { UseCase } from "../../use-cases/ports";
import { MissingParamsError } from "./errors";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest, forbidden, ok, serverError } from "./util";

export class SignInController implements Controller {
  constructor(private readonly signInUseCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!request.body.email || !request.body.password) {
        let missingParam = !request.body.email ? "email " : "";
        missingParam += !request.body.password ? "password" : "";
        return badRequest(new MissingParamsError(missingParam.trim()));
      }
      const response: Either<
        UserNotFoundError | WrongPasswordError,
        AuthenticationResult
      > = await this.signInUseCase.perform({
        email: request.body.email,
        password: request.body.password,
      });

      if (response.value instanceof WrongPasswordError)
        return forbidden(response.value);

      return ok(response.value);
    } catch (error: any) {
      console.error(error);
      return serverError(error.message);
    }
  }
}
