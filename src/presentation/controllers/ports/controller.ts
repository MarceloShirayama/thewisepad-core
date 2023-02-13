import { HttpRequest } from "./http-request";
import { HttpResponse } from "./http-response";

export interface Controller {
  readonly requiredParams: string[];
  handle(request: HttpRequest): Promise<HttpResponse>;
}
