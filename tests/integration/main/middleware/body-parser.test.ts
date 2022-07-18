import request from 'supertest'

import { app } from '@/main/config/app'

describe('Body parser middleware', () => {
  it('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ name: 'test', description: 'description' })
      .expect({ name: 'test', description: 'description' })
  })
})
