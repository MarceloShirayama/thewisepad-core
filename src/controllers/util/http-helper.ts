import { InternalServerError } from '@/controllers/errors'
import { HttpResponse } from '@/controllers/ports'

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError()
})
