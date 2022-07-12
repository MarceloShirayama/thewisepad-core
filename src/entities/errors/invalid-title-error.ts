export class InvalidTitleError extends Error {
  constructor(public readonly email: string) {
    super(`Invalid title: ${email}.`)
    this.name = 'InvalidTitleError'
  }
}
