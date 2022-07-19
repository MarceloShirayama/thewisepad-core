import { BcryptEncoder } from '@/external/encoder'

describe('Bcrypt encode', () => {
  it('Should correctly encoder and decode a string', async () => {
    const encoder = new BcryptEncoder()

    const password = 'password'

    const encoded = await encoder.encode(password)

    expect(await encoder.compare(password, encoded)).toBe(true)
    expect(password).not.toBe(encoded)
  })
})
