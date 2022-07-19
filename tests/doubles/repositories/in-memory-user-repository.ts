import { UserData, UserRepository } from '@/use-cases/ports'

export class InMemoryUserRepository implements UserRepository {
  private readonly _data: UserData[]
  private idCounter: number = 0

  constructor(data: UserData[]) {
    this._data = data
  }

  public get data(): UserData[] {
    return this._data
  }

  async findAll(): Promise<UserData[]> {
    return this._data
  }

  async findByEmail(email: string): Promise<UserData> {
    const found = this.data.find(
      (user: UserData) => user.email === email
    ) as UserData

    return found
  }

  async add(userData: UserData): Promise<UserData> {
    userData.id = this.idCounter.toString()
    this.idCounter++
    this.data.push(userData)

    return userData
  }

  async updateAccessToken(userId: string, accessToken: string): Promise<void> {
    const found = this.data.find((user: UserData) => user.id === userId)
    if (found) {
      found.accessToken = accessToken
    }
  }
}
