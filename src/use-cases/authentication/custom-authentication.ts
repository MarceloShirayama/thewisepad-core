import { Either, left, right } from '@/shared'
import { Encoder, UserRepository } from '@/use-cases/ports'
import { UserNotFoundError, WrongPasswordError } from './errors'
import {
  AuthenticationParams,
  AuthenticationResult,
  AuthenticationService,
  TokenManager
} from './ports'

export class CustomAuthentication implements AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encoder: Encoder,
    private readonly tokenManager: TokenManager
  ) {}

  async auth(
    authenticationParams: AuthenticationParams
  ): Promise<
    Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>
  > {
    const user = await this.userRepository.findByEmail(
      authenticationParams.email
    )

    if (!user) {
      return left(new UserNotFoundError())
    }

    const isValid = await this.encoder.compare(
      authenticationParams.password,
      user.password
    )

    if (!isValid) {
      return left(new WrongPasswordError())
    }

    const id = user.id as string

    const accessToken = await this.tokenManager.sign({ id })

    return right({ accessToken, id })
  }
}
