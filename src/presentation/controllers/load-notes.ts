import { UseCase } from "../../use-cases/ports";
import { MissingParamsError } from "./errors";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest, getMissingParams } from "./util";

export class LoadNotesController implements Controller {
  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParams = ["userId"];

      const missingParams = getMissingParams(request, requiredParams);

      if (missingParams)
        return badRequest(new MissingParamsError(missingParams));

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
