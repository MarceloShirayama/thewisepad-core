import { HttpResponse } from './http-response'

export interface WebController {
  handle(req: any): Promise<HttpResponse>
}
