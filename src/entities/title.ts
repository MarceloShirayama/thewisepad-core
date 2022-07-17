import { InvalidTitleError } from '@/entities/errors'
import { Either, left, right } from '@/shared/either'

export class Title {
  public readonly value: string

  private constructor(title: string) {
    this.value = title
    Object.freeze(this)
  }

  public static create(title: string): Either<InvalidTitleError, Title> {
    if (Title.validate(title)) {
      return right(new Title(title))
    }

    return left(new InvalidTitleError())
  }

  static validate(title: string): boolean {
    if (!title) {
      return false
    }

    const titleTooShort = title.trim().length < 3
    const titleTooLong = title.trim().length > 256

    if (titleTooShort || titleTooLong) {
      return false
    }

    return true
  }
}
