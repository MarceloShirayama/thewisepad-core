import { Either, left, right } from '@/shared/either'
import { Title } from './title'
import { User } from './user'

export class Note {
  private readonly _title: Title
  private readonly _owner: User
  private readonly _content: string

  private constructor(owner: User, title: Title, content: string) {
    this._owner = owner
    this._title = title
    this._content = content
    Object.freeze(this)
  }

  get title(): Title {
    return this._title
  }

  get owner(): User {
    return this._owner
  }

  get content(): string {
    return this._content
  }

  public static create(
    owner: User,
    title: string,
    content: string
  ): Either<Error, Note> {
    const titleOrError = Title.create(title)

    if (titleOrError.isLeft()) {
      return left(titleOrError.value)
    }

    const newTitle: Title = titleOrError.value

    return right(new Note(owner, newTitle, content))
  }
}
