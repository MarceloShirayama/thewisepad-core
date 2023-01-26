import { Encoder } from "@/use-cases/ports";

export class FakeEncoder implements Encoder {
  async encode(plain: string): Promise<string> {
    const hash = `${plain}-ENCRYPTED`;

    return hash;
  }
}
