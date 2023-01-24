import { UserData } from "./user-data";
import { Either, left, right } from "@/shared/either";
import { InvalidEmailError } from "./errors/invalid-email-error";
import { Email } from "./email";
import { Password } from "./password";
import { InvalidPasswordError } from "./errors/invalid-password-error";

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
