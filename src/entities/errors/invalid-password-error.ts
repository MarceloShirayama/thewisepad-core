export class InvalidPasswordError extends Error {
  constructor(public readonly password: string) {
    super('Invalid password')
    this.name = 'InvalidPasswordError'
  }
}
