import { UseCase } from "../../use-cases/ports";
import { Controller, HttpRequest, HttpResponse } from "./ports";

export class UpdateNoteController implements Controller {
  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const useCaseResponse = await this.useCase.perform(request.body);

    const response: HttpResponse = {
      statusCode: 200,
      body: useCaseResponse.value,
    };

    return response;
  }
}
