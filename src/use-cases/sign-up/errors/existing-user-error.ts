import { UserData } from "../../../use-cases/ports";

export class ExistingUserError extends Error {
  private _statusCode: number;

  constructor(userData: UserData, statusCode = 403) {
    super(`User ${userData.email} already exists.`);
    this.name = "ExistingUserError";
    this._statusCode = statusCode;
  }

  get statusCode() {
    return this._statusCode;
  }
}
