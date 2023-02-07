import { Router } from "express";
import { adaptRoute } from "../adapters";
import { makeSignInController } from "../factories/sign-in-controller";

export default (router: Router) => {
  router.post("/sign-in", adaptRoute(makeSignInController()));
};
