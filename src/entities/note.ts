import { Either, left, right } from '@/shared/either'
import { Title } from './title'
import { User } from './user'

export class Note {
  private readonly _title: Title
  private readonly _owner: User

  private constructor(title: Title, owner: User) {
    this._title = title
    this._owner = owner
  }

  get Title(): Title {
    return this._title
  }

  get Owner(): User {
    return this._owner
  }

  public static create(title: string, owner: User): Either<Error, Note> {
    const titleOrError = Title.create(title)

    if (titleOrError.isLeft()) {
      return left(titleOrError.value)
    }

    const newTitle: Title = titleOrError.value

    return right(new Note(newTitle, owner))
  }
}
