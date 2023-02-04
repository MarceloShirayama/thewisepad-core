import { UseCase } from "../../use-cases/ports";
import { Controller, HttpRequest, HttpResponse } from "./ports";
import { badRequest } from "./util";

export class UpdateNoteController implements Controller {
  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const useCaseResponse = await this.useCase.perform(request.body);

    // if(useCaseResponse.isLeft())

    // const response: HttpResponse = {
    //   statusCode: 200,
    //   body: useCaseResponse.value,
    // };

    if (useCaseResponse.isLeft())
      return {
        statusCode: 400,
        body: useCaseResponse.value,
      };

    if (useCaseResponse.isRight())
      return {
        statusCode: 200,
        body: useCaseResponse.value,
      };

    return badRequest(useCaseResponse.value);
  }
}
