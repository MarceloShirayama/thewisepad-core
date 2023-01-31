import { UserData } from "../../use-cases/ports";

export interface UserRepository {
  findAll(): Promise<UserData[]>;
  findByEmail(email: string): Promise<UserData | null>;
  add(userData: UserData): Promise<UserData>;
  updateAccessToken(userId: string, accessToken: string): Promise<void>;
}
