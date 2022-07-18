import { UseCase, UserData } from '@/use-cases/ports'
import { ExistingUserError } from '@/use-cases/sign-up/errors'
import {
  HttpRequest,
  HttpResponse,
  WebController
} from '@/web-controllers/ports'
import {
  badRequest,
  created,
  forbidden,
  serverError
} from '@/web-controllers/util'
import { MissingParamError } from './errors'

export class SignUpController implements WebController {
  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest<UserData>): Promise<HttpResponse> {
    try {
      const requestParamsRequired = ['email', 'password']
      const requestParam = Object.keys(request.body!)
      const missingParam = requestParamsRequired.filter(
        (param) => !requestParam.includes(param)
      )

      if (missingParam.length > 0) {
        return badRequest(new MissingParamError(missingParam.join(', ')))
      }

      const response = await this.useCase.perform({
        email: request.body?.email as string,
        password: request.body?.password as string
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
