import { InvalidEmailError } from '@/entities/errors/invalid-email-error'
import { InvalidPasswordError } from '@/entities/errors/invalid-password-error'
import { User } from '@/entities/user'
import { left } from '@/shared/either'
import { UserDataBuilder } from '../use-cases/builders/user-builder'

describe('User domain entity', () => {
  it('Should not create user with invalid e-mail address', () => {
    const userWithInvalidEmail = UserDataBuilder.validUser()
      .withInvalidEmail()
      .build()
    const error = User.create(userWithInvalidEmail)

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(
      left(new InvalidEmailError(userWithInvalidEmail.email))
    )
  })

  it('Should not create user with invalid password (no numbers)', () => {
    const error = User.create(
      UserDataBuilder.validUser().withPasswordWithoutNumbers().build()
    )

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(left(new InvalidPasswordError()))
  })

  it('Should not create user with invalid password (too few chars)', () => {
    const error = User.create(
      UserDataBuilder.validUser().withPasswordWithFewChars().build()
    )

    expect(error.isLeft()).toBe(true)
    expect(error).toEqual(left(new InvalidPasswordError()))
  })

  it('Should create user with valid data', () => {
    const validUser = UserDataBuilder.validUser().build()
    const user: User = User.create(validUser).value as User

    expect(user.email.value).toBe(validUser.email)
  })
})
