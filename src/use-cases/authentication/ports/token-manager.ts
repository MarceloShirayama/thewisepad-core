import { Either } from "../../../shared";

export type Payload = {
  id: string;
};

export interface TokenManager {
  sign(info: Payload, expires?: string): Promise<string>;
  verify(token: string): Promise<Either<Error, string | object>>;
}
