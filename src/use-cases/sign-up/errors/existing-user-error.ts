import { UserData } from '@/entities/ports'

export class ExistingUserError extends Error {
  constructor(userData: UserData) {
    super(`User ${userData.email} already registered`)
    this.name = 'ExistingUserError'
  }
}
