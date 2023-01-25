import { Either, left, right } from "@/shared";
import { UserData } from "@/use-cases/ports";
import { Email, Password } from ".";
import { InvalidEmailError, InvalidPasswordError } from "./errors";

export class User {
  private readonly _email: Email;
  private readonly _password: Password;

  private constructor(email: Email, password: Password) {
    this._email = email;
    this._password = password;
    Object.freeze(this);
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  public static create(
    userData: UserData
  ): Either<InvalidEmailError | InvalidPasswordError, User> {
    const emailOrError = Email.create(userData.email);

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError(userData.email));
    }

    const email = emailOrError.value;

    const passwordOrError = Password.create(userData.password);

    if (passwordOrError.isLeft()) {
      return left(new InvalidPasswordError(userData.password));
    }

    const password = passwordOrError.value;

    return right(new User(email, password));
  }
}
