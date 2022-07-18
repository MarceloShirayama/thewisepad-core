import { bodyParser } from '@/main/middleware'
import { Express } from 'express'

export const setupMiddleware = (app: Express): void => {
  app.use(bodyParser)
}
