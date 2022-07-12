export class InvalidTitleError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidTitleError'
  }
}
