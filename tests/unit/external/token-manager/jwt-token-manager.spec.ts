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

  it(`should return a JsonWebTokenError object if the signature is invalid
    `, async () => {
    const secret = 'secret'
    const info: Payload = { id: 'id' }

    const tokenManager = new JwtTokenManager(secret)

    const tokenSign = await tokenManager.sign(info)

    const invalidToken = tokenSign + 'invalid'

    const tokenVerify = await tokenManager.verify(invalidToken)
    const decodeError = tokenVerify.value as Token

    expect(tokenVerify.isLeft()).toBeTruthy()
    expect(decodeError).toEqual(
      expect.objectContaining({
        name: 'JsonWebTokenError',
        message: 'invalid signature'
      })
    )
  })

  it('Should correctly verify expired json web tokens', async () => {
    const secret = 'secret'
    const info: Payload = { id: 'id' }

    const tokenManager = new JwtTokenManager(secret)
    const expiresIn = '1s'

    const tokenSign = await tokenManager.sign(info, expiresIn)

    const tokenVerify = await tokenManager.verify(tokenSign)

    const decoded = tokenVerify.value as Token

    expect(decoded).toEqual(
      expect.objectContaining({
        id: 'id',
        iat: expect.any(Number),
        exp: expect.any(Number)
      })
    )
  })
})
