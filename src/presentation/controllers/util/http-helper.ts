import { HttpResponse } from "@/presentation/controllers/ports";

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: error,
});
