export class MissingParamsError extends Error {
  private _statusCode: number;

  constructor(param: string, statusCode = 400) {
    super(`Missing param: ${param}.`);
    this.name = "MissingParamsError";
    this._statusCode = statusCode;
  }

  get statusCode() {
    return this._statusCode;
  }
}
