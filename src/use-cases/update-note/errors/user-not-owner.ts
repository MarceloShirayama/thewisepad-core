export class UserNotOwnerError extends Error {
  constructor() {
    super('user do not owner this note')
    this.name = 'UserNotOwnerError'
  }
}
