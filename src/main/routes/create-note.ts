import { Router } from "express";

import { adaptRoute } from "../adapters";
import { makeCreateNoteController } from "../factories/create-note-controller";
import { authentication } from "../middleware/authentication";

export default (router: Router) => {
  router.post("/notes", authentication, adaptRoute(makeCreateNoteController()));
};
