export class InvalidEmailError extends Error {
  constructor(public readonly email: string) {
    super(`Invalid email: ${email}.`)
    this.name = 'InvalidEmailError'
  }
}
