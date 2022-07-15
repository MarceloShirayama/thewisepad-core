import { UserData } from '@/entities/user-data'
import { Either, left, right } from '@/shared/either'
import { Encoder } from '../ports/encoder'
import { UserRepository } from '../ports/user-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { WrongPasswordError } from './errors/wrong-password-error'

export class Signin {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encoder: Encoder
  ) {}

  public async perform(
    signinRequest: UserData
  ): Promise<Either<UserNotFoundError | WrongPasswordError, UserData>> {
    const user = await this.userRepository.findUserByEmail(signinRequest.email)

    if (!user) {
      return left(new UserNotFoundError())
    }

    const checkPassword = this.encoder.compare(
      signinRequest.password,
      user.password
    )

    if (!checkPassword) {
      return left(new WrongPasswordError())
    }

    return right(user)
  }
}
