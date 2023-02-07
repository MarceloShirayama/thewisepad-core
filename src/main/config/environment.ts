import { config } from "dotenv";

config();

export const env = {
  JWT_SECRET: process.env.JWT_SECRET as string,
};
