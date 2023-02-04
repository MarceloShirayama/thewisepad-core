import { Note, User } from "src/entities";
import { InvalidTitleError } from "src/entities/errors/invalid-title-error";
import { left } from "src/shared";

describe("Note entity", () => {
  it("Should be created with a valid title and owner", () => {
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

  it("Should not be created with a invalid title", () => {
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

  it("should be created with empty content if content is undefined", () => {
    const validTitle = "my note";
    const validEmail = "my@mail.com";
    const validPassword = "1valid_password";
    const nullContent = null;

    const validOwner: User = User.create({
      email: validEmail,
      password: validPassword,
    }).value as User;

    const note: Note = Note.create(validOwner, validTitle, nullContent)
      .value as Note;

    expect(note.title.value).toEqual("my note");
    expect(note.owner.email.value).toEqual("my@mail.com");
    expect(note.content).toEqual("");
  });

  test("should be created with empty content if content is undefined", () => {
    const validTitle = "my note";
    const validEmail = "my@mail.com";
    const validPassword = "1valid_password";
    const undefinedContent = undefined;

    const validOwner: User = User.create({
      email: validEmail,
      password: validPassword,
    }).value as User;

    const note: Note = Note.create(validOwner, validTitle, undefinedContent)
      .value as Note;

    expect(note.title.value).toEqual("my note");
    expect(note.owner.email.value).toEqual("my@mail.com");
    expect(note.content).toEqual("");
  });
});
