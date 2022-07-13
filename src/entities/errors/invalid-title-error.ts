export class InvalidTitleError extends Error {
  constructor() {
    super('Invalid title')
    this.name = 'InvalidTitleError'
  }
}
