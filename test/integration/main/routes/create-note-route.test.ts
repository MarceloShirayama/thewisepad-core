import request from "supertest";

import { MongoHelper } from "src/external/repositories/mongodb/helpers";
import {
  makeEncoder,
  makeTokenManager,
  makeUserRepository,
} from "src/main/factories";
import { NoteBuilder } from "test/builders/note-builder";
import { UserBuilder } from "test/builders/user-builder";
import { app } from "src/main/config/app";

describe.skip("Sign-in route", () => {
  let validUser = UserBuilder.createUser().build();
  const aNote = NoteBuilder.createNote().build();
  let anotherUser = UserBuilder.createUser().withDifferentEmail().build();
  let token: string | null = null;

  beforeAll(async () => {
    await MongoHelper.connect();
    const userRepo = makeUserRepository();
    const encoder = makeEncoder();
    const tokenManager = makeTokenManager();
    validUser = await userRepo.add({
      email: validUser.email,
      password: await encoder.encode(validUser.password),
    });
    anotherUser = await userRepo.add({
      email: anotherUser.email,
      password: await encoder.encode(anotherUser.password),
    });
    const id = validUser.id as string;
    token = await tokenManager.sign({ id });
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("should not be able to create note for another user", async () => {
    app.post("/test_cors", (req, res) => {
      res.send();
    });
    await request(app)
      .post("/api/notes")
      .set("x-access-token", token as string)
      .send({
        title: aNote.title,
        content: aNote.content,
        ownerEmail: anotherUser.email,
        ownerId: anotherUser.id,
      })
      .expect(403);
  });
});
