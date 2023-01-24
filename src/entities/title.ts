import { Either, left, right } from "@/shared/either";
import { InvalidTitleError } from "./errors/invalid-title-error";

export class Title {
  readonly value: string;

  private constructor(title: string) {
    this.value = title;
  }

  static create(title: string): Either<InvalidTitleError, Title> {
    return Title.validate(title)
      ? right(new Title(title))
      : left(new InvalidTitleError());
  }

  static validate(title: string) {
    return title.trim().length >= 3 && title.trim().length <= 256;
  }
}
