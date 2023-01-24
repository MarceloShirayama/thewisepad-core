export class InvalidEmailError extends Error {
  private _statusCode: number;

  constructor(paramName: string, statusCode = 400) {
    super(`Invalid param: ${paramName}`);
    this.name = "InvalidEmailError";
    this._statusCode = statusCode;
  }

  get statusCode() {
    return this._statusCode;
  }
}
