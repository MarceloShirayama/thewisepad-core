import { UserData } from '@/use-cases/ports'

export class ExistingUserError extends Error {
  constructor(userData: UserData) {
    super(`User ${userData.email} already registered`)
    this.name = 'ExistingUserError'
  }
}
