export class UserNotFoundError extends Error {
  private _statusCode: number;

  constructor(statusCode = 400) {
    super("User not found.");
    this.name = "UserNotFoundError";
    this._statusCode = statusCode;
  }

  get statusCode() {
    return this._statusCode;
  }
}
