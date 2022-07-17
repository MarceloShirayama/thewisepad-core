import { HttpResponse } from './http-response'

export interface Controller {
  handle(req: any): Promise<HttpResponse>
}
