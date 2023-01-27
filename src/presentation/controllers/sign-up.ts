import { UserData } from "@/use-cases/ports";
import { SignUp } from "@/use-cases/sign-up";
import { ExistingUserError } from "@/use-cases/sign-up/errors";
import { Controller, HttpResponse } from "./ports";
import { badRequest, created, forbidden, serverError } from "./util";

export class SignUpController implements Controller {
  constructor(private readonly useCase: SignUp) {}

  async handle(request: UserData): Promise<HttpResponse> {
    try {
      const response = await this.useCase.perform(request);

      if (response.isRight()) return created(response.value);

      if (response.isLeft() && response.value instanceof ExistingUserError)
        return forbidden(response.value);

      return badRequest(response.value);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
