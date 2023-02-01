import { UseCase } from "../../use-cases/ports";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest, ok, serverError } from "./util";

export class SignInController implements Controller {
  constructor(private readonly signInUseCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const response = await this.signInUseCase.perform({
        email: request.body.email,
        password: request.body.password,
      });

      if (response.isRight()) return ok(response.value);

      return badRequest(response.value);
    } catch (error: any) {
      console.error(error);
      return serverError(error.message);
    }
  }
}
