import { UserData } from '@/entities/user-data'
import { UserRepository } from '@/use-cases/ports/user-repository'

export class InMemoryUserRepository implements UserRepository {
  private readonly _data: UserData[]

  constructor(data: UserData[]) {
    this._data = data
  }

  public get data(): UserData[] {
    return this._data
  }

  async findAllUsers(): Promise<UserData[]> {
    return this._data
  }

  async findUserByEmail(email: string): Promise<UserData> {
    const user = this.data.find((user) => user.email === email)

    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  async addUser(userData: UserData): Promise<UserData> {
    this.data.push(userData)

    return userData
  }
}
