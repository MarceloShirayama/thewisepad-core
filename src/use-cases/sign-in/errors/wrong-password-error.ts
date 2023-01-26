export class WrongPasswordError extends Error {
  private _statusCode: number;

  constructor(statusCode = 400) {
    super("Wrong password.");
    this.name = "WrongPasswordError";
    this._statusCode = statusCode;
  }

  get statusCode() {
    return this._statusCode;
  }
}
