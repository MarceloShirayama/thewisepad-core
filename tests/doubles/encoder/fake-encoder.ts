import { Encoder } from "@/use-cases/sign-up/ports";

export class FakeEncoder implements Encoder {
  async encode(plain: string): Promise<string> {
    const hash = `${plain}-ENCRYPTED`;

    return hash;
  }
}