import { UserData } from "@/entities/user-data";

export class ExistingUserError extends Error {
  private _statusCode: number;

  constructor(userData: UserData, statusCode = 400) {
    super(`User ${userData.email} already exists.`);
    this.name = "ExistingUserError";
    this._statusCode = statusCode;
  }

  get statusCode() {
    return this._statusCode;
  }
}
