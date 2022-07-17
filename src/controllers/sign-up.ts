import { HttpResponse } from '@/controllers/ports'
import { badRequest, ok } from '@/controllers/util'
import { UserData } from '@/use-cases/ports'
import { SignUp } from '@/use-cases/sign-up'

export class SignUpController {
  constructor(private readonly useCase: SignUp) {}

  async handle(request: UserData): Promise<HttpResponse> {
    const response = await this.useCase.perform(request)

    if (response.isRight()) {
      return ok(request)
    }

    return badRequest()
  }
}
