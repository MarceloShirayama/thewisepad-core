import { UserData } from "@/use-cases/ports";

export class UserBuilder {
  private user: UserData = {
    email: "any@mail.com",
    password: "1valid_password",
  };

  static createUser(): UserBuilder {
    return new UserBuilder();
  }

  withInvalidEmail(): UserBuilder {
    this.user.email = "invalid_email";
    return this;
  }

  withUnregisteredUser(): UserBuilder {
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
    this.user.password = "1wrong_password";
    return this;
  }

  build(): UserData {
    return this.user;
  }
}
