import { UseCase } from "../../use-cases/ports";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest, ok } from "./util";

export class RemoveNoteController implements Controller {
  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const useCaseResponse = await this.useCase.perform(request.body.noteId);

    if (useCaseResponse.isRight()) return ok(useCaseResponse.value);

    return badRequest(useCaseResponse.value);
  }
}
