import { Controller, HttpRequest, HttpResponse } from '@/controllers/ports'
import { badRequest, created, forbidden, serverError } from '@/controllers/util'
import { SignUp } from '@/use-cases/sign-up'
import { ExistingUserError } from '@/use-cases/sign-up/errors'

export class SignUpController implements Controller {
  constructor(private readonly useCase: SignUp) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const response = await this.useCase.perform({
        email: request.body.email,
        password: request.body.password
      })

      if (response.isRight()) {
        return created(response.value)
      }

      if (response.isLeft() && response.value instanceof ExistingUserError) {
        return forbidden(response.value)
      }

      return badRequest(response.value)
    } catch (error: any) {
      return serverError()
    }
  }
}
