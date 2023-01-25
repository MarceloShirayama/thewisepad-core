import { UserData } from "@/use-cases/ports";

export interface UserRepository {
  findAllUsers(): Promise<UserData[]>;
  findUserByEmail(email: string): Promise<UserData | null>;
  addUser(userData: UserData): Promise<UserData>;
}
