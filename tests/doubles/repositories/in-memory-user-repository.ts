import { UserData, UserRepository } from "src/use-cases/ports";

export class InMemoryUserRepository implements UserRepository {
  private readonly _data: UserData[];
  private idCounter = 0;

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
    userData.id = this.idCounter.toString();
    this.idCounter++;
    this._data.push(userData);

    return userData;
  }

  async updateAccessToken(userId: string, accessToken: string): Promise<void> {
    const userExists = this._data.find((user) => user.id === userId);

    if (userExists) userExists.accessToken = accessToken;
  }
}
