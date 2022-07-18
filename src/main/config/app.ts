import express from 'express'
import { setupMiddleware } from './setup-middleware'

export const app = express()

setupMiddleware(app)
