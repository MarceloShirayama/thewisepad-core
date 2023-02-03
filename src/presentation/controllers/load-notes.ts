import { UseCase } from "../../use-cases/ports";
import { Controller, HttpRequest, HttpResponse } from "./ports";

export class LoadNotesController implements Controller {
  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const useCaseResponse = await this.useCase.perform(request.body.userId);

      const response: HttpResponse = {
        statusCode: 200,
        body: useCaseResponse,
      };

      return response;
    } catch (error) {
      return {
        statusCode: 500,
        body: error,
      };
    }
  }
}
