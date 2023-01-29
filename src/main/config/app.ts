import express from "express";

import { setupMiddleware } from "./setup-middleware";
import { setupRoutes } from "./setup-routes";

export const app = express();

setupMiddleware(app);

setupRoutes(app);
