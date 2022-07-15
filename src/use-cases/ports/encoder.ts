export interface Encoder {
  encode(plain: string): Promise<string>
  compare(plain: string, hash: string): Promise<boolean>
}
