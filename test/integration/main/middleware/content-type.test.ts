import { describe, test } from "vitest";

import request from "supertest";
import { app } from "src/main/config/app";

describe("Content type middleware", () => {
  test("Should return default content type as json", async () => {
    app.get("/test_content_type", (req, res) => {
      res.send("");
    });
    await request(app).get("/test_content_type").expect("content-type", /json/);
  });

  test("Should return xml type when forced", async () => {
    app.get("/test_content_type_xml", (req, res) => {
      res.type("xml");
      res.send("");
    });
    await request(app)
      .get("/test_content_type_xml")
      .expect("content-type", /xml/);
  });
});
