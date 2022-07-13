export class ExistingTitleError extends Error {
  constructor() {
    super('User already has note with the same title.')
  }
}
