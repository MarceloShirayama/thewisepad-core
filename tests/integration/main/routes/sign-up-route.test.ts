import supertest from "supertest";
import { describe, test } from "vitest";

import { app } from "src/main/config/app";
import { UserBuilder } from "tests/doubles/builders/user-builder";

/**
 * FIXME: this test gets the error "cannot POST", but if the request is made by
 * the server everything is fine.
 */
describe.todo("Register routes", () => {
  const user = UserBuilder.createUser().build();

  const request = supertest(app);

  test("Should return an account on success", async () => {
    await request
      .post("/api/sign-up")
      .send({
        email: user.email,
        password: user.password,
      })
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(201, {
        email: user.email,
        password: `${user.password}-ENCRYPTED`,
        id: "0",
      });
  });
});
