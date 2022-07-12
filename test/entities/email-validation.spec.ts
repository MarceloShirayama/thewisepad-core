import { Email } from '@/entities/email'

describe('Email validation', () => {
  it('Should not accept null string', () => {
    const email = null as any as string

    expect(Email.validate(email)).toBeFalsy()
  })

  it('Should not accept empty string', () => {
    const email = ''

    expect(Email.validate(email)).toBeFalsy()
  })

  it('Should accept valid email', () => {
    const email = 'any@mail.com'

    expect(Email.validate(email)).toBeTruthy()
  })

  it('Should not accept strings larger than 320chars', () => {
    const email = 'l'.repeat(64) + '@' + 'd'.repeat(127) + '.' + 'd'.repeat(128)

    expect(Email.validate(email)).toBeFalsy()
  })

  it('should not accept local part larger than 64 chars', () => {
    const email = 'l'.repeat(65) + '@mail.com'

    expect(Email.validate(email)).toBeFalsy()
  })

  test('should not accept domain part larger than 255 chars', () => {
    const email = 'local@' + 'd'.repeat(128) + '.' + 'd'.repeat(127)

    expect(Email.validate(email)).toBeFalsy()
  })

  it('should not accept empty local part', () => {
    const email = '@mail.com'

    expect(Email.validate(email)).toBeFalsy()
  })

  it('should not accept empty domain', () => {
    const email = 'any@'

    expect(Email.validate(email)).toBeFalsy()
  })

  it('should not accept domain with a part larger than 63 chars', () => {
    const email1 = 'any@' + 'd'.repeat(64) + '.com'
    const email2 = 'any@' + 'mail' + 'c'.repeat(64)

    expect(Email.validate(email1)).toBeFalsy()
    expect(Email.validate(email2)).toBeFalsy()
  })

  it('should not accept local part with invalid char', () => {
    const email = 'any email@mail.com'

    expect(Email.validate(email)).toBeFalsy()
  })

  it('should not accept local part with two dots', () => {
    const email = 'any..email@mail.com'

    expect(Email.validate(email)).toBeFalsy()
  })

  it('should not accept local part with ending dot', () => {
    const email = 'any.@mail.com'

    expect(Email.validate(email)).toBeFalsy()
  })

  it('should not accept email without an at-sign', () => {
    const email = 'any_mail.com'

    expect(Email.validate(email)).toBeFalsy()
  })
})
