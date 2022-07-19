import { BcryptEncoder } from '@/external/encoder'

describe('Bcrypt encode', () => {
  it('Should correctly encoder and decode a string', async () => {
    const encoder = new BcryptEncoder()

    const password = 'password'

    const encoded = await encoder.encode(password)
    console.log({ encoded })

    expect(await encoder.compare(password, encoded)).toBe(true)
    expect(password).not.toBe(encoded)
  })

  it('Should be able configure salt rounds', async () => {
    const saltRounds = 5
    const encoder = new BcryptEncoder(saltRounds)
    const password = 'password'

    const encoded = await encoder.encode(password)

    expect(await encoder.compare(password, encoded)).toBe(true)
    expect(password).not.toBe(encoded)
  })
})
