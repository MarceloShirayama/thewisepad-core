import { InvalidTitleError } from "../../entities/errors";
import { Either } from "../../shared";
import {
  ExistingTitleError,
  UnregisteredOwnerError,
} from "../../use-cases/create-note/errors";
import { NoteData, UseCase } from "../../use-cases/ports";
import { MissingParamsError } from "./errors";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest, created, getMissingParams, serverError } from "./util";

export class CreateNoteController implements Controller {
  readonly requiredParams = ["title", "content", "ownerEmail"];

  constructor(private readonly useCase: UseCase) {}

  async specificOp(request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams = getMissingParams(request, this.requiredParams);

      if (missingParams)
        return badRequest(new MissingParamsError(missingParams));

      const noteRequest: NoteData = {
        title: request.body.title,
        content: request.body.content,
        ownerEmail: request.body.ownerEmail,
      };

      const response: Either<
        ExistingTitleError | UnregisteredOwnerError | InvalidTitleError,
        NoteData
      > = await this.useCase.perform(noteRequest);

      if (response.isRight()) return created(response.value);

      return badRequest(response.value);
    } catch (error) {
      if (error instanceof Error) return serverError(error);
      console.error("Unexpected error", error);
      return serverError(new Error("Unexpected error"));
    }
  }
}
