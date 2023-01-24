import { Either, left, right } from "@/shared/either";
import { InvalidTitleError } from "./errors/invalid-title-error";
import { Title } from "./title";
import { User } from "./user";

export class Note {
  private readonly _title: Title;
  private readonly _owner: User;

  private constructor(owner: User, title: Title) {
    this._owner = owner;
    this._title = title;
  }

  get title() {
    return this._title;
  }

  get owner() {
    return this._owner;
  }

  static create(owner: User, title: string): Either<InvalidTitleError, Note> {
    const titleOrError = Title.create(title);

    if (titleOrError.isLeft()) return left(titleOrError.value);

    return right(new Note(owner, titleOrError.value));
  }
}
