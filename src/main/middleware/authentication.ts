import { makeAuthMiddleware } from "../factories";
import { adaptMiddleware } from "../adapters";

export const authMiddleware = adaptMiddleware(makeAuthMiddleware());
