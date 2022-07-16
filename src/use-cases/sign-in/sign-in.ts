import { UserData } from '@/entities/ports/user-data'
import { Either, left, right } from '@/shared/either'
import { Encoder } from '../ports/encoder'
import { UserRepository } from '../ports/user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { WrongPasswordError } from './errors/wrong-password-error'

export class SignIn {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encoder: Encoder
  ) {}

  public async perform(
    signInRequest: UserData
  ): Promise<Either<UserNotFoundError | WrongPasswordError, UserData>> {
    const user = await this.userRepository.findByEmail(signInRequest.email)

    if (!user) {
      return left(new UserNotFoundError())
    }

    const checkPassword = await this.encoder.compare(
      signInRequest.password,
      user.password
    )

    if (!checkPassword) {
      return left(new WrongPasswordError())
    }

    return right(signInRequest)
  }
}
