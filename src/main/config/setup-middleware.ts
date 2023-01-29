import { Express } from "express";
import { bodyParser, contentType, cors } from "@/main/middleware";

export function setupMiddleware(app: Express): void {
  app.disable("x-powered-by");
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
}
