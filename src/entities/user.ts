import { Either, left, right } from '@/shared/either'
import { Email } from './email'
import { InvalidEmailError } from './errors/invalid-email-error'
import { InvalidPasswordError } from './errors/invalid-password-error'
import { Password } from './password'
import { UserData } from './user-data'

export class User {
  private readonly _email: Email

  private constructor(email: Email) {
    this._email = email
  }

  get email(): Email {
    return this._email
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

    if (passwordOrError.isLeft()) {
      return left(new InvalidPasswordError(userData.password))
    }

    return right(new User(email))
  }
}
