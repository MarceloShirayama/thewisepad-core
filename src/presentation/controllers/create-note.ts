import {
  ExistingTitleError,
  UnregisteredOwnerError,
} from "../../use-cases/create-note/errors";
import { Either } from "../../shared";
import { NoteData, UseCase } from "../../use-cases/ports";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { InvalidTitleError } from "../../entities/errors";
import { badRequest, created } from "./util";

export class CreateNoteController implements Controller {
  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
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
  }
}
