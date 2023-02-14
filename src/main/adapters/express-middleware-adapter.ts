import { NextFunction, Request, Response } from "express";

import { Middleware } from "../../presentation/middleware/ports";

export function adaptMiddleware(middleware: Middleware) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      accessToken: req.headers?.["x-access-token"],
      requesterId: req.body.ownerId ? req.body.ownerId : req.body.userId,
    };

    const httpResponse = await middleware.handle(request);

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      Object.assign(req, httpResponse.body);

      next();
    } else {
      res
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.body.message });
    }
  };
}
