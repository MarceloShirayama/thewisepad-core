import { UserData } from '@/entities/ports/user-data'
import { Either, left, right } from '@/shared/either'
import { Encoder, UserRepository } from '@/use-cases/ports'
import {
  UserNotFoundError,
  WrongPasswordError
} from '@/use-cases/sign-in/errors'

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
