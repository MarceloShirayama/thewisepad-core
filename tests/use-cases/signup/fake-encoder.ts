import { Encoder } from '@/use-cases/signup/ports/encoder'

export class FakeEncoder implements Encoder {
  encode(plain: string): Promise<string> {
    return Promise.resolve(plain + 'ENCRYPTED')
  }
}
