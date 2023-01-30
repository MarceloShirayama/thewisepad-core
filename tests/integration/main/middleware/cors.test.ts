import { describe, test } from "vitest";

import request from "supertest";
import { app } from "src/main/config/app";

describe("Cors Middleware", () => {
  test("Should enable cors", async () => {
    test("should enable CORS", async () => {
      app.post("/test_cors", (_req, res) => {
        res.send();
      });
      await request(app)
        .get("/test_cors")
        .expect("access-control-allow-origin", "*")
        .expect("access-control-allow-headers", "*")
        .expect("access-control-allow-methods", "*");
    });
  });
});
