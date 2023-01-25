export class UnregisteredOwnerError extends Error {
  private _statusCode: number;

  constructor(email: string, statusCode = 400) {
    super(`Owner: ${email} is unregistered.`);
    this.name = "UnregisteredOwnerError";
    this._statusCode = statusCode;
  }

  get statusCode() {
    return this._statusCode;
  }
}
