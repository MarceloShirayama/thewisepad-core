import { Either, left, right } from "@/shared";
import { UserData } from "@/use-cases/ports";
import { Email, Password } from ".";
import { InvalidEmailError, InvalidPasswordError } from "./errors";

type UserInput = {
  email: string;
  password: string;
};

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

  public static create({
    email,
    password,
  }: UserInput): Either<InvalidEmailError | InvalidPasswordError, User> {
    const emailOrError = Email.create(email);

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError(email));
    }

    const emailObject = emailOrError.value;

    const passwordOrError = Password.create(password);

    if (passwordOrError.isLeft()) {
      return left(new InvalidPasswordError(password));
    }

    const passwordObject = passwordOrError.value;

    return right(new User(emailObject, passwordObject));
  }
}
