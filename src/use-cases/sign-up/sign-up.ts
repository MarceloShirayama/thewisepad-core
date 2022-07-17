import { User } from '@/entities'
import { InvalidEmailError, InvalidPasswordError } from '@/entities/errors'
import { UserData } from '@/entities/ports'
import { Either, left, right } from '@/shared'
import { Encoder, UserRepository } from '@/use-cases/ports'
import { ExistingUserError } from '@/use-cases/sign-up/errors'

export class SignUp {
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

    const userAlreadyExists = await this.userRepository.findByEmail(
      userSignupRequest.email
    )

    if (userAlreadyExists) {
      return left(new ExistingUserError(userSignupRequest))
    }

    const encodedPassword = await this.encoder.encode(
      userSignupRequest.password
    )

    const newUser = await this.userRepository.add({
      email: userSignupRequest.email,
      password: encodedPassword
    })

    return right(newUser)
  }
}
