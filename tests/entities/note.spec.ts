import { describe, expect, test } from "vitest";

import { Note, User } from "@/entities";
import { InvalidTitleError } from "@/entities/errors/invalid-title-error";
import { left } from "@/shared";

describe("Note entity", () => {
  test("Should be created with a valid title and owner", () => {
    const validTitle = "my note";
    const validEmail = "my@mail.com";
    const validPassword = "1validPassword";
    const content = "content";

    const validOwner = User.create({
      email: validEmail,
      password: validPassword,
    }).value as User;

    const note = Note.create(validOwner, validTitle, content).value as Note;

    expect(note.owner.email.value).toBe(validEmail);
    expect(note.title.value).toBe(validTitle);
  });

  test("Should not be created with a invalid title", () => {
    const inValidTitle = "my";
    const validEmail = "my@mail.com";
    const validPassword = "1validPassword";
    const content = "content";

    const validOwner = User.create({
      email: validEmail,
      password: validPassword,
    }).value as User;

    const error = Note.create(validOwner, inValidTitle, content);

    expect(error).toEqual(left(new InvalidTitleError(inValidTitle)));
  });
});
