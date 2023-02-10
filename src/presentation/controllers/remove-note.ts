import { UseCase } from "../../use-cases/ports";
import { MissingParamsError } from "./errors";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest, getMissingParams, ok } from "./util";

export class RemoveNoteController implements Controller {
  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const requiredParams = ["noteId"];

    const missingParams = getMissingParams(request, requiredParams);

    if (missingParams) return badRequest(new MissingParamsError(missingParams));

    const useCaseResponse = await this.useCase.perform(request.body.noteId);

    if (useCaseResponse.isRight()) return ok(useCaseResponse.value);

    return badRequest(useCaseResponse.value);
  }
}
