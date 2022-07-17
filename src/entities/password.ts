import { InvalidPasswordError } from '@/entities/errors'
import { Either, left, right } from '@/shared/either'

export class Password {
  private readonly _value: string

  private constructor(password: string) {
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
      return left(new InvalidPasswordError())
    }

    return right(new Password(password))
  }

  public static validate(password: string): boolean {
    if (!Password.hasNumber(password) || Password.lengthTooShort(password)) {
      return false
    }

    return true
  }

  private static lengthTooShort(str: string): boolean {
    return str.trim().length < 6
  }

  private static hasNumber(str: string): boolean {
    return /\d/.test(str)
  }
}
