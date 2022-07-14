import { InvalidEmailError } from '@/entities/errors/invalid-email-error'
import { InvalidPasswordError } from '@/entities/errors/invalid-password-error'
import { User } from '@/entities/user'
import { UserData } from '@/entities/user-data'
import { Either, left, right } from '@/shared/either'
import { Encoder } from '../ports/encoder'
import { UserRepository } from '../ports/user-repository'
import { ExistingUserError } from './errors/existing-user-error'

export class Signup {
  private readonly _userRepository: UserRepository
  private readonly _encoder: Encoder

  constructor(userRepository: UserRepository, encoder: Encoder) {
    this._userRepository = userRepository
    this._encoder = encoder
  }

  private get userRepository(): UserRepository {
    return this._userRepository
  }

  private get encoder(): Encoder {
    return this._encoder
  }

  public async perform(
    userSignupRequest: UserData
  ): Promise<
    Either<
      ExistingUserError | InvalidEmailError | InvalidPasswordError,
      UserData
    >
  > {
    const userOrError = User.create(userSignupRequest)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const userAlreadyExists = await this.userRepository.findUserByEmail(
      userSignupRequest.email
    )

    if (userAlreadyExists) {
      return left(new ExistingUserError(userSignupRequest))
    }

    const encodedPassword = await this.encoder.encode(
      userSignupRequest.password
    )

    const newUser = await this.userRepository.addUser({
      email: userSignupRequest.email,
      password: encodedPassword
    })

    return right(newUser)
  }
}
