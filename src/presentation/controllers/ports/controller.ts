import { UseCase } from "@/use-cases/ports";
import { HttpRequest } from "./http-request";
import { HttpResponse } from "./http-response";

export abstract class Controller {
  protected readonly useCase: UseCase;

  constructor(useCase: UseCase) {
    this.useCase = useCase;
  }

  abstract handle(request: HttpRequest): Promise<HttpResponse>;
}
