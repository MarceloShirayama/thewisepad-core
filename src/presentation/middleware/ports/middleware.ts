import { HttpResponse } from "../../controllers/ports";

export interface Middleware<T = any> {
  handle(httpRequest: T): Promise<HttpResponse>;
}
