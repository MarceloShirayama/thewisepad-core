import { UserData } from '@/entities/user-data'

export class UserDataBuilder {
  private user: UserData = {
    email: 'valid@mail.com',
    password: 'valid_password_1',
    id: '0'
  }

  public static validUser(): UserDataBuilder {
    return new UserDataBuilder()
  }

  public withInvalidEmail(): UserDataBuilder {
    this.user.email = 'invalid_email'
    return this
  }

  public withPasswordWithoutNumber(): UserDataBuilder {
    this.user.password = 'invalid_password'
    return this
  }

  public withPasswordWithFewChars(): UserDataBuilder {
    this.user.password = '1abc'
    return this
  }

  public withUnregisteredUser(): UserDataBuilder {
    this.user.email = 'unregistered@mail.com'

    return this
  }

  public build(): UserData {
    return this.user
  }
}
