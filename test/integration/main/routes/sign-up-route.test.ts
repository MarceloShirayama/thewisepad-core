import supertest from "supertest";
import { describe, test, expect } from "vitest";
import axios from "axios";

import { app } from "src/main/config/app";
import { UserBuilder } from "test/builders/user-builder";

/**
 * FIXME: this test gets the error "cannot POST" with supertest, but if the
 * request is made by
 * the server everything is fine
 * as a palliative I am using axios
 */
describe("Register routes", () => {
  const user = UserBuilder.createUser().build();

  // const request = supertest(app);

  // test("Should return an account on success", async () => {
  //   await request
  //     .post("/api/sign-up")
  //     .send({
  //       email: user.email,
  //       password: user.password,
  //     })
  //     .expect(201, {
  //       email: user.email,
  //       password: `${user.password}-ENCRYPTED`,
  //       id: "0",
  //     });
  // });
  test("Should return an account on success", async () => {
    const { data } = await axios({
      method: "POST",
      url: "http://localhost:3000/api/sign-up",
      data: {
        email: user.email,
        password: user.password,
      },
    });

    expect(data).toHaveProperty("accessToken");
    expect(data).toHaveProperty("id");
  });
});
