export class ExistingTitleError extends Error {
  private _statusCode: number;

  constructor(statusCode = 400) {
    super("User already has note with the same title.");
    this.name = "ExistingTitleError";
    this._statusCode = statusCode;
  }

  get statusCode() {
    return this._statusCode;
  }
}
