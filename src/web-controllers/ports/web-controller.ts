import { UseCase } from '@/use-cases/ports/use-case'
import { HttpRequest } from './http-request'
import { HttpResponse } from './http-response'

export abstract class WebController {
  constructor(protected readonly useCase: UseCase) {}

  abstract handle(req: HttpRequest): Promise<HttpResponse>
}
