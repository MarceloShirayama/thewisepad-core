export class AccessDeniedError extends Error {
  private _statusCode: number;

  constructor(statusCode = 403) {
    super("Access denied.");
    this.name = "AccessDeniedError";
    this._statusCode = statusCode;
  }

  get statusCode() {
    return this._statusCode;
  }
}
