import { UseCase } from "src/use-cases/ports";

export class ErrorThrowingUseCaseStub implements UseCase {
  async perform(request: any): Promise<any> {
    throw new Error("purposeful error for testing.");
  }
}

export function makeErrorThrowingUseCaseStub() {
  class ErrorThrowingUseCaseStub implements UseCase {
    async perform(request: any): Promise<any> {
      throw new Error("purposeful error for testing.");
    }
  }

  const errorThrowingSignInUseCaseStub = new ErrorThrowingUseCaseStub();

  return errorThrowingSignInUseCaseStub;
}
