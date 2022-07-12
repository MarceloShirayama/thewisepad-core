import { Either, left, right } from '@/shared/either'
import { Email } from './email'
import { InvalidEmailError } from './errors/invalid-email-error'
import { UserData } from './user-data'

export class User {
  public readonly email: Email

  private constructor(email: Email) {
    this.email = email
  }

  public static create(userData: UserData): Either<InvalidEmailError, User> {
    const emailOrError = Email.create(userData.email)

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError(emailOrError.value.message))
    }

    const email: Email = emailOrError.value

    return right(new User(email))
  }
}
