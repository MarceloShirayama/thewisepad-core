import { HttpResponse } from '@/controllers/ports'

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const badRequest = (): HttpResponse => ({
  statusCode: 400,
  body: 'Bad Request'
})
