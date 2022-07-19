import request from 'supertest'

import { app } from '@/main/config/app'

describe('Register routes', () => {
  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/sign-up')
      .send({
        email: 'any@mail.com',
        password: 'valid_password_123'
      })
      .expect(201, {
        accessToken: 'accessToken',
        id: '0'
      })
  })
})
