import { UserData } from '@/entities/user-data'
import { NoteData } from '@/use-cases/ports/note-data'
import { UserDataBuilder } from './user-builder'

export class NoteDataBuilder {
  private readonly owner: UserData = UserDataBuilder.validUser().build()
  private readonly note: NoteData = {
    title: 'valid title',
    content: 'valid content',
    ownerEmail: this.owner.email,
    ownerId: this.owner.id
  }

  public static validNote(): NoteDataBuilder {
    return new NoteDataBuilder()
  }

  public withTitleWithFewChars(): NoteDataBuilder {
    this.note.title = 'a'

    return this
  }

  public withTitleWithManyChars(): NoteDataBuilder {
    this.note.title = 'a'.repeat(257)

    return this
  }

  public build(): NoteData {
    return this.note
  }
}
