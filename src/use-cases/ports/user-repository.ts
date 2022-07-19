import { UserData } from './user-data'

export interface UserRepository {
  findAll(): Promise<UserData[]>
  findByEmail(email: string): Promise<UserData>
  add(user: UserData): Promise<UserData>
  updateAccessToken(userId: string, accessToken: string): Promise<void>
}
