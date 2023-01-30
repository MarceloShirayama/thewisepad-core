import { ExistingUserError } from "../../use-cases/sign-up/errors";
import { MissingParamsError } from "./errors";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest, created, forbidden, serverError } from "./util";

export class SignUpController extends Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!request.body.email || !request.body.password) {
        let missingParam = !request.body.email ? "email " : "";
        missingParam += !request.body.password ? "password" : "";

        return badRequest(new MissingParamsError(missingParam.trim()));
      }

      const response = await this.useCase.perform({
        email: request.body.email,
        password: request.body.password,
      });

      if (response.isRight()) return created(response.value);

      if (response.isLeft() && response.value instanceof ExistingUserError)
        return forbidden(response.value);

      return badRequest(response.value);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
