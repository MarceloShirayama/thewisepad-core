import { Either, left, right } from '@/shared/either'
import { Email } from './email'
import { InvalidEmailError } from './errors/invalid-email-error'
import { InvalidPasswordError } from './errors/invalid-password-error'
import { Password } from './password'
import { UserData } from './ports/user-data'

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
    userData: UserData
  ): Either<InvalidEmailError | InvalidPasswordError, User> {
    const emailOrError = Email.create(userData.email)

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError(userData.email))
    }

    const email: Email = emailOrError.value

    const passwordOrError = Password.create(userData.password)

    const password: Password = passwordOrError.value as Password

    if (passwordOrError.isLeft()) {
      return left(new InvalidPasswordError())
    }

    return right(new User(email, password))
  }
}
