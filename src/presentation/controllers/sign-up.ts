import { UserData } from "@/use-cases/ports";
import { SignUp } from "@/use-cases/sign-up";
import { ExistingUserError } from "@/use-cases/sign-up/errors";
import { HttpResponse } from "./ports";
import { badRequest, created, forbidden } from "./util";

export class SignUpController {
  constructor(private readonly useCase: SignUp) {}

  async handle(request: UserData): Promise<HttpResponse> {
    const response = await this.useCase.perform(request);

    if (response.isRight()) return created(response.value);

    if (response.isLeft() && response.value instanceof ExistingUserError)
      return forbidden(response.value);

    return badRequest(response.value);
  }
}
