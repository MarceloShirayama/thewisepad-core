import { UseCase } from "../../use-cases/ports";
import { MissingParamsError } from "./errors";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest, getMissingParams, ok, serverError } from "./util";

export class RemoveNoteController implements Controller {
  readonly requiredParams = ["noteId"];

  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams = getMissingParams(request, this.requiredParams);

      if (missingParams)
        return badRequest(new MissingParamsError(missingParams));

      const useCaseResponse = await this.useCase.perform(request.body.noteId);

      if (useCaseResponse.isRight()) return ok(useCaseResponse.value);

      return badRequest(useCaseResponse.value);
    } catch (error) {
      if (error instanceof Error) return serverError(error);
      console.error("Unexpected error", error);
      return serverError(new Error("Unexpected error"));
    }
  }
}
