import { UserData } from '@/entities/user-data'

export interface UserRepository {
  findAll(): Promise<UserData[]>
  findByEmail(email: string): Promise<UserData>
  add(user: UserData): Promise<UserData>
}
