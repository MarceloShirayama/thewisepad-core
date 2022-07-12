import { UserData } from '@/entities/user-data'
import { UserRepository } from './ports/user-repository'
import { Encoder } from './signup/ports/encoder'

export class Signup {
  private readonly _userRepository: UserRepository
  private readonly _encoder: Encoder

  constructor(userRepository: UserRepository, encoder: Encoder) {
    this._userRepository = userRepository
    this._encoder = encoder
  }

  // private get userRepository(): UserRepository {
  //   return this._userRepository
  // }

  private get encoder(): Encoder {
    return this._encoder
  }

  public async perform(userSignupRequest: UserData): Promise<UserData> {
    const encodedPassword = await this.encoder.encode(
      userSignupRequest.password
    )

    this._userRepository.addUser({
      email: userSignupRequest.email,
      password: encodedPassword
    })

    return userSignupRequest
  }
}
