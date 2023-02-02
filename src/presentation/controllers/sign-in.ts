import { left } from "src/shared";
import { UseCase } from "../../use-cases/ports";
import { MissingParamsError } from "./errors";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest, ok, serverError } from "./util";

export class SignInController implements Controller {
  constructor(private readonly signInUseCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!request.body.email || !request.body.password) {
        let missingParam = !request.body.email ? "email " : "";
        missingParam += !request.body.password ? "password" : "";
        return badRequest(new MissingParamsError(missingParam.trim()));
      }
      const response = await this.signInUseCase.perform({
        email: request.body.email,
        password: request.body.password,
      });

      return ok(response.value);
    } catch (error: any) {
      console.error(error);
      return serverError(error.message);
    }
  }
}
