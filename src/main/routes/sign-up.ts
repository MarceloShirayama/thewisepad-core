import { Router } from "express";

import { adaptRoute } from "../adapters/express-route-adapter";
import { makeSignUpController } from "../../main/factories";

export default (router: Router) => {
  router.post("/sign-up", adaptRoute(makeSignUpController()));
};
