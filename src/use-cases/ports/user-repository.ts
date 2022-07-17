import { UserData } from '@/entities/ports'

export interface UserRepository {
  findAll(): Promise<UserData[]>
  findByEmail(email: string): Promise<UserData>
  add(user: UserData): Promise<UserData>
}
