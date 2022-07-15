import { Encoder } from '@/use-cases/ports/encoder'

export class FakeEncoder implements Encoder {
  public async encode(plain: string): Promise<string> {
    return plain + 'ENCRYPTED'
  }

  public async compare(plain: string, hash: string): Promise<boolean> {
    if (hash === plain + 'ENCRYPTED') {
      return true
    }

    return false
  }
}
