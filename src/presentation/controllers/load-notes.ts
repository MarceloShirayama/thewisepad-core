import { UseCase } from "../../use-cases/ports";
import { MissingParamsError } from "./errors";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest, getMissingParams, ok, serverError } from "./util";

export class LoadNotesController implements Controller {
  readonly requiredParams = ["userId"];

  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams = getMissingParams(request, this.requiredParams);

      if (missingParams)
        return badRequest(new MissingParamsError(missingParams));

      const useCaseResponse = await this.useCase.perform(request.body.userId);

      return ok(useCaseResponse);
    } catch (error) {
      if (error instanceof Error) return serverError(error);
      console.error("Unexpected error", error);
      return serverError(new Error("Unexpected error"));
    }
  }
}
