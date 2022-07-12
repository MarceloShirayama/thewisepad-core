import { Either, left, right } from '@/shared/either'
import { InvalidPasswordError } from './errors/invalid-password-error'

export class Password {
  private readonly _value: string

  constructor(password: string) {
    this._value = password
    Object.freeze(this)
  }

  get value(): string {
    return this._value
  }

  public static create(
    password: string
  ): Either<InvalidPasswordError, Password> {
    if (!Password.validate(password)) {
      return left(new InvalidPasswordError(password))
    }

    return right(new Password(password))
  }

  public static validate(password: string): boolean {
    if (!password) {
      return false
    }

    if (!Password.hasNumber(password) || password.length < 6) {
      return false
    }

    return true
  }

  private static hasNumber(str: string): boolean {
    return /\d/.test(str)
  }
}
