import request from 'supertest'

import { app } from '@/main/config/app'

describe('Cors middleware', () => {
  it('Should enable cors', async () => {
    app.get('/test_cors', (req, res) => {
      res.send(req.query)
    })

    await request(app)
      .get('/test_cors')
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Headers', '*')
      .expect('Access-Control-Allow-Methods', '*')
  })
})
