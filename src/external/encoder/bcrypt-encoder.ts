import bcrypt from 'bcrypt'

import { Encoder } from '@/use-cases/ports'

export class BcryptEncoder implements Encoder {
  constructor(private readonly saltRounds: number = 10) {}

  async encode(plain: string): Promise<string> {
    return await bcrypt.hash(plain, this.saltRounds)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash)
  }
}
