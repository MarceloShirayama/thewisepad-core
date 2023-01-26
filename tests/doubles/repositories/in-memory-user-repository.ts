import { randomUUID } from "node:crypto";

import { UserData, UserRepository } from "@/use-cases/ports";

export class InMemoryUserRepository implements UserRepository {
  private readonly _data: UserData[];

  constructor(data: UserData[]) {
    this._data = data;
  }

  async findAll(): Promise<UserData[]> {
    return this._data;
  }

  async findByEmail(email: string): Promise<UserData | null> {
    const user = this._data.find((user) => user.email === email);

    return user ? user : null;
  }

  async add(userData: UserData): Promise<UserData> {
    userData.id = randomUUID();
    this._data.push(userData);

    return userData;
  }
}
