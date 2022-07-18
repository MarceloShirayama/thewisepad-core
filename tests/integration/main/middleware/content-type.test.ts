import request from 'supertest'

import { app } from '@/main/config/app'

describe('Content type middleware', () => {
  it('Should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send(req.query)
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', 'application/json; charset=utf-8')
  })

  it('Should return xml content type when forced', async () => {
    app.get('/test_content_type_xml', (_req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', 'application/xml; charset=utf-8')
  })
})
