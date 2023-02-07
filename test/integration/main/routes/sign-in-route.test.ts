import request from "supertest";

import { MongoHelper } from "src/external/repositories/mongodb/helpers";
import { app } from "src/main/config/app";

describe.skip("SignIn route", () => {
  beforeAll(async () => {
    await MongoHelper.connect();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("should successfully sign in", async () => {
    app.post("/test_cors", (req, res) => {
      res.send();
    });

    await request(app).post("/api/sign-up").send({
      email: "any@mail.com",
      password: "1valid_password",
    });

    app.post("/test_cors", (req, res) => {
      res.send();
    });

    await request(app)
      .post("/api/sign-in")
      .send({
        email: "any@mail.com",
        password: "1valid_password",
      })
      .expect(200)
      .then((res) => {
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.id).toBeDefined();
      });
  });
});
