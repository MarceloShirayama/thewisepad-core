import { UserData } from '@/entities/user-data'
import { Either, left, right } from '@/shared/either'
import { UserRepository } from '../ports/user-repository'
import { ExistingUserError } from './errors/existing-user-error'
import { Encoder } from './ports/encoder'

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
  ): Promise<Either<ExistingUserError, UserData>> {
    const user = await this.userRepository.findUserByEmail(
      userSignupRequest.email
    )

    if (user) {
      return left(new ExistingUserError(userSignupRequest))
    }

    const encodedPassword = await this.encoder.encode(
      userSignupRequest.password
    )

    this.userRepository.addUser({
      email: userSignupRequest.email,
      password: encodedPassword
    })

    return right(userSignupRequest)
  }
}
