import { UseCase } from "../../use-cases/ports";
import { MissingParamsError } from "./errors";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest, getMissingParams, serverError } from "./util";

export class UpdateNoteController implements Controller {
  readonly requiredParams = ["id", "ownerEmail", "ownerId"];
  readonly requiredUpdateParams = ["title", "content"];

  constructor(private readonly useCase: UseCase) {}

  async specificOp(request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingNoteParams = getMissingParams(request, this.requiredParams);

      if (missingNoteParams)
        return badRequest(new MissingParamsError(missingNoteParams));

      const missingUpdateParams = getMissingParams(
        request,
        this.requiredUpdateParams
      );

      if (missingUpdateParams.includes(this.requiredUpdateParams.join(", ")))
        return badRequest(new MissingParamsError(missingUpdateParams));

      const useCaseResponse = await this.useCase.perform(request.body);

      if (useCaseResponse.isLeft())
        return {
          statusCode: 400,
          body: useCaseResponse.value,
        };

      return {
        statusCode: 200,
        body: useCaseResponse.value,
      };
    } catch (error) {
      if (error instanceof Error) return serverError(error);
      console.error("Unexpected error", error);
      return serverError(new Error("Unexpected error"));
    }
  }
}
