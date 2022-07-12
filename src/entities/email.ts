import { Either, left, right } from '@/shared/either'
import { InvalidEmailError } from './errors/invalid-email-error'

export class Email {
  public readonly value: string

  private constructor(email: string) {
    this.value = email
  }

  public static create(email: string): Either<InvalidEmailError, Email> {
    if (Email.validate(email)) {
      return right(new Email(email))
    }

    return left(new InvalidEmailError(`Invalid email: ${email}`))
  }

  public static validate(email: string): boolean {
    if (!email) {
      return false
    }

    if (email.length > 320) {
      return false
    }

    const emailRegex =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

    if (!emailRegex.test(email)) {
      return false
    }

    const [local, domain] = email.split('@')

    if (local && (local.length > 64 || local.length < 1)) {
      return false
    }

    if (domain && (domain.length > 255 || domain.length < 1)) {
      return false
    }

    const domainParts = domain?.split('.')

    if (domainParts?.some((part) => part.length > 63)) {
      return false
    }

    return true
  }
}
