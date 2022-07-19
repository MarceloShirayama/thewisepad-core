import { JwtTokenManager } from '@/external/token-manager/jwt-token-manager'
import { Payload } from '@/use-cases/authentication/ports'

describe('JWT token manager', () => {
  it('Should correctly sign and verify a json web token', async () => {
    const secret = 'secret'
    const info: Payload = { id: 'id' }

    const tokenManager = new JwtTokenManager(secret)

    const tokenSign = await tokenManager.sign(info)

    const tokenVerify = await tokenManager.verify(tokenSign)

    const decoded = tokenVerify.value as { id: string; iat: number }

    expect(decoded).toEqual({ id: 'id', iat: expect.any(Number) })
    expect(tokenSign).not.toBe(info)
  })
})
