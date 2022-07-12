export class InvalidTitleError extends Error {
  constructor(email: string) {
    super(`Invalid title: ${email}.`)
    this.name = 'InvalidTitleError'
  }
}
