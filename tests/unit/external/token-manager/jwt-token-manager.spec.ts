import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import sinon from 'sinon'

import { JwtTokenManager } from '@/external/token-manager/jwt-token-manager'
import { Payload } from '@/use-cases/authentication/ports'

type Token = {
  [key: string]: any
}

describe('JWT token manager', () => {
  it('Should correctly sign and verify a json web token', async () => {
    const secret = 'secret'
    const info: Payload = { id: 'id' }

    const tokenManager = new JwtTokenManager(secret)

    const tokenSign = await tokenManager.sign(info)

    const tokenVerify = await tokenManager.verify(tokenSign)

    const decoded = tokenVerify.value as Token

    expect(decoded).toEqual({ id: 'id', iat: expect.any(Number) })
    expect(tokenSign).not.toBe(info)
  })

  it(`should return a JsonWebTokenError object if the token is expired
    `, async () => {
    const secret = 'secret'
    const info: Payload = { id: 'id' }

    const tokenManager = new JwtTokenManager(secret)

    const tokenSign = await tokenManager.sign(info)

    const invalidToken = tokenSign + 'invalid'

    const tokenVerify = await tokenManager.verify(invalidToken)
    const decodedError = tokenVerify.value as JsonWebTokenError

    expect(tokenVerify.isLeft()).toBeTruthy()
    expect(decodedError).toBeInstanceOf(JsonWebTokenError)
    expect(decodedError).toEqual(
      expect.objectContaining({
        name: 'JsonWebTokenError',
        message: 'invalid signature'
      })
    )
  })

  it('Should correctly verify expired json web tokens', async () => {
    const clock = sinon.useFakeTimers()
    const secret = 'secret'
    const info: Payload = { id: 'id' }

    const tokenManager = new JwtTokenManager(secret)
    const expiresIn = '1h'

    const tokenSign = await tokenManager.sign(info, expiresIn)
    clock.tick(3600100)

    const tokenVerify = await tokenManager.verify(tokenSign)

    const decodedError = tokenVerify.value as TokenExpiredError

    expect(tokenVerify.isLeft()).toBeTruthy()
    expect(decodedError).toBeInstanceOf(TokenExpiredError)
    expect(decodedError).toEqual(
      expect.objectContaining({
        name: 'TokenExpiredError',
        message: 'jwt expired',
        expiredAt: expect.any(Date)
      })
    )
    clock.restore()
  })
})
