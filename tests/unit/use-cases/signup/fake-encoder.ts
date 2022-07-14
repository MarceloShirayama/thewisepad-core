import { Encoder } from '@/use-cases/signup/ports/encoder'

export class FakeEncoder implements Encoder {
  public async encode(plain: string): Promise<string> {
    return plain + 'ENCRYPTED'
  }
}
