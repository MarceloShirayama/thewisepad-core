import bcrypt from "bcrypt";
import { env } from "../../main/config/environment";

import { Encoder } from "../../use-cases/ports";

export class BcryptEncoder implements Encoder {
  private readonly rounds: number;

  constructor(rounds: number = env.BCRYPT_ROUNDS) {
    this.rounds = rounds;
  }

  async encode(plain: string): Promise<string> {
    const encryptedData = await bcrypt.hash(plain, this.rounds);
    return encryptedData;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    const isEqual = await bcrypt.compare(plain, hashed);
    return isEqual;
  }
}
