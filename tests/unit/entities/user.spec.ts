import { User } from '@/entities'
import { InvalidEmailError, InvalidPasswordError } from '@/entities/errors'
import { left } from '@/shared'
import { UserDataBuilder } from '@/tests/builders'

describe('User domain entity', () => {
  it('Should not create user with invalid e-mail address', () => {
    const userWithInvalidEmail = UserDataBuilder.validUser()
      .withInvalidEmail()
      .build()
    const error = User.create(
      userWithInvalidEmail.email,
      userWithInvalidEmail.password
    )

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(
      left(new InvalidEmailError(userWithInvalidEmail.email))
    )
  })

  it('Should not create user with invalid password (no numbers)', () => {
    const invalidUser = UserDataBuilder.validUser()
      .withPasswordWithoutNumbers()
      .build()
    const error = User.create(invalidUser.email, invalidUser.password)

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(left(new InvalidPasswordError()))
  })

  it('Should not create user with invalid password (too few chars)', () => {
    const invalidUser = UserDataBuilder.validUser()
      .withPasswordWithFewChars()
      .build()
    const error = User.create(invalidUser.email, invalidUser.password)

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(left(new InvalidPasswordError()))
  })

  it('Should create user with valid data', () => {
    const validUser = UserDataBuilder.validUser().build()
    const user: User = User.create(validUser.email, validUser.password)
      .value as User

    expect(user.email.value).toBe(validUser.email)
  })
})
