import { BcryptEncoder } from "../../external/encoder";

export function makeEncoder() {
  return new BcryptEncoder();
}
