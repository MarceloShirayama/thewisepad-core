import { Router } from "express";

import { adaptRoute } from "../../main/adapter/express-route-adapter";
import { makeSignUpController } from "../../main/factories";

export default (router: Router) => {
  router.post("/sign-up", adaptRoute(makeSignUpController()));
};
