import { NextFunction, Request, Response } from 'express'

export const cors = (_req: Request, res: Response, next: NextFunction) => {
  res.header({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*'
  })
  next()
}
