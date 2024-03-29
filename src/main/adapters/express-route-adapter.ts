import { Request, Response } from "express";

import { Controller, HttpRequest } from "../../presentation/controllers/ports";

export function adaptRoute(controller: Controller) {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };

    const httpResponse = await controller.specificOp(httpRequest);

    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
}
