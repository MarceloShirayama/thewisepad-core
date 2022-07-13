import { InvalidEmailError } from '@/entities/errors/invalid-email-error'
import { InvalidPasswordError } from '@/entities/errors/invalid-password-error'
import { User } from '@/entities/user'
import { left } from '@/shared/either'

const validEmail = 'valid@mail.com'
const validPassword = 'valid_password_1'
const invalidEmail = 'invalid_email'
const invalidPasswordWithoutNumbers = 'invalid_password'
const invalidPasswordWithTooFewCharacters = '123ab'

describe('User domain entity', () => {
  it('Should not create user with invalid e-mail address', () => {
    const error = User.create({ email: invalidEmail, password: validPassword })

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(left(new InvalidEmailError(invalidEmail)))
  })

  it('Should not create user with invalid password (no numbers)', () => {
    const validEmail = 'valid@mail.com'
    const error = User.create({
      email: validEmail,
      password: invalidPasswordWithoutNumbers
    })

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(left(new InvalidPasswordError()))
  })

  it('Should not create user with invalid password (too few chars)', () => {
    const error = User.create({
      email: validEmail,
      password: invalidPasswordWithTooFewCharacters
    })

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(left(new InvalidPasswordError()))
  })

  it('Should create user with valid data', () => {
    const user: User = User.create({
      email: validEmail,
      password: validPassword
    }).value as User

    expect(user.email.value).toBe(validEmail)
  })
})
