import { Email, Password } from '@/entities'
import { InvalidEmailError, InvalidPasswordError } from '@/entities/errors'
import { Either, left, right } from '@/shared/either'

export class User {
  private readonly _email: Email
  private readonly _password: Password

  private constructor(email: Email, password: Password) {
    this._email = email
    this._password = password
    Object.freeze(this)
  }

  get email(): Email {
    return this._email
  }

  get password(): Password {
    return this._password
  }

  public static create(
    email: string,
    password: string
  ): Either<InvalidEmailError | InvalidPasswordError, User> {
    const emailOrError = Email.create(email)

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError(email))
    }

    const emailObject: Email = emailOrError.value as Email

    const passwordOrError = Password.create(password)

    const passwordObject = passwordOrError.value as Password

    if (passwordOrError.isLeft()) {
      return left(new InvalidPasswordError())
    }

    return right(new User(emailObject, passwordObject))
  }
}
