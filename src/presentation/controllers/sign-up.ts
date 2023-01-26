import { UserData } from "@/use-cases/ports";
import { SignUp } from "@/use-cases/sign-up";
import { HttpResponse } from "./ports";
import { badRequest, ok } from "./util";

export class SignUpController {
  constructor(private readonly useCase: SignUp) {}

  async handle(request: UserData): Promise<HttpResponse> {
    const response = await this.useCase.perform(request);

    if (response.isRight()) return ok(request);

    return badRequest(response.value);
  }
}
