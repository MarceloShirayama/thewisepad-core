import { readdirSync } from "node:fs";
import { join } from "path";
import { Express, Router } from "express";

export function setupRoutes(app: Express) {
  const routesPath = join(__dirname, "..", "routes");

  const router = Router();

  app.use("/api", router);

  readdirSync(routesPath).forEach(async (file) => {
    (await import(`${routesPath}/${file}`)).default(router);
  });
}
