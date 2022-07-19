import jwt from 'jsonwebtoken'

import { Either, left, right } from '@/shared'
import { Payload, TokenManager } from '@/use-cases/authentication/ports'

export class JwtTokenManager implements TokenManager {
  constructor(private readonly secret: string) {}

  async sign(info: Payload, expires?: string): Promise<string> {
    if (expires) {
      return jwt.sign(info, this.secret, { expiresIn: expires })
    }

    return jwt.sign(info, this.secret)
  }

  async verify(token: string): Promise<Either<Error, string | object>> {
    try {
      const decoded = jwt.verify(token, this.secret)

      return right(decoded as string)
    } catch (error) {
      const err = error as Error
      return left(err)
    }
  }
}
