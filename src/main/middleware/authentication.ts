import { makeAuthMiddleware } from "../factories";
import { adaptMiddleware } from "../adapters";

export const authentication = adaptMiddleware(makeAuthMiddleware());
