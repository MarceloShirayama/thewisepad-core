import { Express } from "express";
import { bodyParser } from "@/main/middleware";

export function setupMIddleware(app: Express): void {
  app.use(bodyParser);
}
