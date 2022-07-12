import { InvalidEmailError } from '@/entities/errors/invalid-email-error'
import { User } from '@/entities/user'
import { left } from '@/shared/either'

describe('User domain entity', () => {
  it('Should not create user with invalid e-mail address', () => {
    const invalidEmail = 'invalid_email'
    const validPassword = 'valid_password'
    const error = User.create({ email: invalidEmail, password: validPassword })

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(left(new InvalidEmailError(invalidEmail)))
  })

  it('Should create user with valid data', () => {
    const validEmail = 'any@mail.com'
    const validPassword = 'valid_password'
    const user: User = User.create({
      email: validEmail,
      password: validPassword
    }).value as User

    expect(user.email.value).toBe(validEmail)
  })
})
