import { randomUUID } from 'crypto'

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
    userData.id = randomUUID()
    this.data.push(userData)

    return userData
  }
}
