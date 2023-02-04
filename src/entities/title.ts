import { Either, left, right } from "../shared";
import { InvalidTitleError } from "./errors";

export class Title {
  readonly value: string;

  private constructor(title: string) {
    this.value = title;
  }

  static create(title: string): Either<InvalidTitleError, Title> {
    return Title.isValid(title)
      ? right(new Title(title))
      : left(new InvalidTitleError(title));
  }

  static isValid(title: string) {
    const emptyOrTooLittle = !title || title.trim().length < 3;
    const tooLarge = title.length > 256;

    return !emptyOrTooLittle && !tooLarge;
  }
}
