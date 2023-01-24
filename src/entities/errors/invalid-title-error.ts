export class InvalidTitleError extends Error {
  private _statusCode: number;

  constructor(paramName: string, statusCode = 400) {
    super(`Invalid param: ${paramName}`);
    this.name = "InvalidTitleError";
    this._statusCode = statusCode;
  }

  get statusCode() {
    return this._statusCode;
  }
}
