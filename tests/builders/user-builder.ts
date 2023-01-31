import { UserData } from "src/use-cases/ports";

export class UserBuilder {
  private readonly user: UserData = {
    email: "any@mail.com",
    password: "valid_password_1",
    id: "0",
  };

  static createUser(): UserBuilder {
    return new UserBuilder();
  }

  withInvalidEmail(): UserBuilder {
    this.user.email = "invalid_email";
    return this;
  }

  withDifferentEmail(): UserBuilder {
    this.user.email = "another@mail.com";
    return this;
  }

  withPasswordWithTooFewChars(): UserBuilder {
    this.user.password = "1abc";
    return this;
  }

  withPasswordWithoutNumbers(): UserBuilder {
    this.user.password = "invalid_password";
    return this;
  }

  withWrongPassword(): UserBuilder {
    this.user.password = "wrong_password_1";
    return this;
  }

  withHashPassword(): UserBuilder {
    this.user.password = `${this.user.password}-ENCRYPTED`;
    return this;
  }

  build(): UserData {
    return this.user;
  }
}
