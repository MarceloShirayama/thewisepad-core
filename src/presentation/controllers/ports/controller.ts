import { UseCase } from "../../../use-cases/ports";
import { HttpRequest } from "./http-request";
import { HttpResponse } from "./http-response";

export abstract class Controller {
  constructor(protected readonly useCase: UseCase) {}

  abstract handle(request: HttpRequest): Promise<HttpResponse>;
}
