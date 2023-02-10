import { Router } from "express";

import { adaptRoute } from "../adapters";
import {
  makeCreateNoteController,
  makeRemoveNoteController,
} from "../factories";
import { authentication } from "../middleware/authentication";

export default (router: Router) => {
  router.post("/notes", authentication, adaptRoute(makeCreateNoteController()));
  router.delete(
    "/notes/:noteId",
    authentication,
    adaptRoute(makeRemoveNoteController())
  );
};
