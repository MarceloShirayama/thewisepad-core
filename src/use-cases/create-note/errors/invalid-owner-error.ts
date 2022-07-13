export class UnregisteredOwnerError extends Error {
  constructor() {
    super('Unregistered owner.')
    this.name = 'UnregisteredOwnerError'
  }
}
