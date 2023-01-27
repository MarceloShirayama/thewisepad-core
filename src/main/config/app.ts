import express from "express";
import { setupMIddleware } from "./setup-middleware";

const app = express();

setupMIddleware(app);

export { app };
