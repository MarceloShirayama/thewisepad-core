import { Encoder } from "src/use-cases/ports";

export class FakeEncoder implements Encoder {
  async encode(plain: string): Promise<string> {
    const hash = `${plain}-ENCRYPTED`;

    return hash;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return `${plain}-ENCRYPTED` === hashed;
  }
}
