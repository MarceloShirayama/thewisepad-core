import { UserData } from "./user-data";
import { Either, left, right } from "@/shared/either";
import { InvalidEmailError } from "./errors/invalid-email-error";
import { Email } from "./email";

export class User {
  private readonly _email: Email;

  private constructor(email: Email) {
    this._email = email;
  }

  get email() {
    return this._email;
  }

  public static create(userData: UserData): Either<InvalidEmailError, User> {
    const emailOrError = Email.create(userData.email);

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError());
    }

    const email = emailOrError.value;

    return right(new User(email));
  }
}
