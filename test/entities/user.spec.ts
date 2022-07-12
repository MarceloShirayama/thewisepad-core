import { InvalidEmailError } from '@/entities/errors/invalid-email-error'
import { InvalidPasswordError } from '@/entities/errors/invalid-password-error'
import { User } from '@/entities/user'
import { left } from '@/shared/either'

describe('User domain entity', () => {
  it('Should not create user with invalid e-mail address', () => {
    const invalidEmail = 'invalid_email'
    const validPassword = 'valid_password_1'
    const error = User.create({ email: invalidEmail, password: validPassword })

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(left(new InvalidEmailError(invalidEmail)))
  })

  it('Should not create user with invalid password (no numbers)', () => {
    const validEmail = 'valid@mail.com'
    const invalidPassword = 'invalid_password'
    const error = User.create({ email: validEmail, password: invalidPassword })

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(left(new InvalidPasswordError(invalidPassword)))
  })

  it('Should not create user with invalid password (too few chars)', () => {
    const validEmail = 'valid@mail.com'
    const invalidPassword = '123ab'

    const error = User.create({ email: validEmail, password: invalidPassword })

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(left(new InvalidPasswordError(invalidPassword)))
  })

  it('Should create user with valid data', () => {
    const validEmail = 'any@mail.com'
    const validPassword = 'valid_password_1'
    const user: User = User.create({
      email: validEmail,
      password: validPassword
    }).value as User

    console.log({ user })

    expect(user.email.value).toBe(validEmail)
  })
})
