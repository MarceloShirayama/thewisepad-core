import { NextFunction, Request, Response } from 'express'

export const contentType = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header('Content-Type', 'application/json')
  next()
}
