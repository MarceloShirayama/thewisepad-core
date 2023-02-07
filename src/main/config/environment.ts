import { config } from "dotenv";

config();

export const env = {
  JWT_SECRET: process.env.JWT_SECRET as string,
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS),
};
