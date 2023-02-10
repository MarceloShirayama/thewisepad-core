export class NoExistentNoteError extends Error {
  private _statusCode: number;

  constructor(statusCode = 400) {
    super("Note does not exist.");
    this.name = "NoExistentNoteError";
    this._statusCode = statusCode;
  }

  get statusCode() {
    return this._statusCode;
  }
}
