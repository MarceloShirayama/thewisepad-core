import { UseCase } from "../../use-cases/ports";
import { MissingParamsError } from "./errors";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest, getMissingParams, ok, serverError } from "./util";

export class RemoveNoteController implements Controller {
  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParams = ["noteId"];

      const missingParams = getMissingParams(request, requiredParams);

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
