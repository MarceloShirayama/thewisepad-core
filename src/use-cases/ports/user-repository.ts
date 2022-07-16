import { UserData } from '@/entities/ports/user-data'

export interface UserRepository {
  findAll(): Promise<UserData[]>
  findByEmail(email: string): Promise<UserData>
  add(user: UserData): Promise<UserData>
}
