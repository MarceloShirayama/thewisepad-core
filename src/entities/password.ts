import { Either, left, right } from "@/shared/either";
import { InvalidPasswordError } from "./errors/invalid-password-error";

export class Password {
  private readonly _value: string;

  private constructor(password: string) {
    this._value = password;
  }

  get value() {
    return this._value;
  }

  static create(password: string): Either<InvalidPasswordError, Password> {
    return Password.validate(password)
      ? right(new Password(password))
      : left(new InvalidPasswordError(password));
  }

  static validate(password: string) {
    return !!password && Password.hasNumber(password) && password.length >= 6;
  }

  private static hasNumber(str: string) {
    return /\d/.test(str);
  }
}
