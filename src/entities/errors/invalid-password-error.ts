export class InvalidPasswordError extends Error {
  constructor(public readonly password: string) {
    super(`Invalid password: ${password}`)
    this.name = 'InvalidPasswordError'
  }
}
