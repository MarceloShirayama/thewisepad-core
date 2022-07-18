import { HttpRequest } from './http-request'
import { HttpResponse } from './http-response'

export interface WebController {
  handle(req: HttpRequest): Promise<HttpResponse>
}
