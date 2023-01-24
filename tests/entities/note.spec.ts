import { InvalidTitleError } from "@/entities/errors/invalid-title-error";
import { Note } from "@/entities/note";
import { User } from "@/entities/user";
import { left } from "@/shared/either";
import { describe, expect, test } from "vitest";

describe("Note entity", () => {
  test("Should be created with a valid title and owner", () => {
    const validTitle = "my note";
    const validEmail = "my@mail.com";
    const content = "content";

    const validOwner = User.create({ email: validEmail }).value as User;

    const note = Note.create(validOwner, validTitle, content).value as Note;

    expect(note.owner.email.value).toBe(validEmail);
    expect(note.title.value).toBe(validTitle);
  });

  test("Should not be created with a invalid title", () => {
    const validTitle = "my";
    const validEmail = "my@mail.com";
    const content = "content";

    const validOwner = User.create({ email: validEmail }).value as User;

    const error = Note.create(validOwner, validTitle, content);

    expect(error).toEqual(left(new InvalidTitleError()));
  });
});
