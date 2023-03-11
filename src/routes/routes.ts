import { Express, Request, Response } from "express";

import user from "./user.routes";
import session from "./session.routes";
// import auth from "./auth.routes";

export default function (app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.use(session);
  app.use(user);
  // app.use(auth);
}
