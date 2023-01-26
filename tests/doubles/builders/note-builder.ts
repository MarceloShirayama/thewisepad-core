import { NoteData, UserData } from "@/use-cases/ports";
import { UserBuilder } from "./user-builder";

export class NoteBuilder {
  private readonly owner: UserData = UserBuilder.createUser().build();
  private readonly note: NoteData = {
    title: "any title",
    content: "any content",
    ownerEmail: this.owner.email,
    ownerId: this.owner.id,
    id: "0",
  };

  static createNote(): NoteBuilder {
    return new NoteBuilder();
  }

  withTitleWithoutChars(): NoteBuilder {
    this.note.title = "";
    return this;
  }

  withTitleWithTooFewChars(): NoteBuilder {
    this.note.title = "a".repeat(2);
    return this;
  }

  withTitleWithExcessChars(): NoteBuilder {
    this.note.title = "a".repeat(257);
    return this;
  }

  withDifferentTitleAndContent(): NoteBuilder {
    this.note.title = "another title";
    this.note.content = "another content";
    return this;
  }

  withDifferentTitleAndId(): NoteBuilder {
    this.note.id = "1";
    this.note.title = "another title";
    return this;
  }

  build(): NoteData {
    return this.note;
  }
}
