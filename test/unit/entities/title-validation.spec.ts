import { Title } from "src/entities";

describe("Title validation", () => {
  test("Should not accept empty strings", () => {
    const title = "";

    expect(Title.isValid(title)).toBeFalsy();
  });

  test("Should accept valid title", () => {
    const title1 = "a".repeat(3);
    const title2 = "a".repeat(256);

    expect(Title.isValid(title1)).toBeTruthy();
    expect(Title.isValid(title2)).toBeTruthy();
  });

  test("Should not accept strings less than 3", () => {
    const title = "a".repeat(2);

    expect(Title.isValid(title)).toBeFalsy();
  });

  test("Should not accept strings larger than 256", () => {
    const title = "a".repeat(257);

    expect(Title.isValid(title)).toBeFalsy();
  });
});
