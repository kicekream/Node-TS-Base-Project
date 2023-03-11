import express from "express";
import config from "config";

import connect from "./db/connect";
import log from "./logger";
import routes from "./routes/routes";

const port = config.get<number>("port");
const app = express();

app.use(express.json());

app.listen(port, async () => {
  log.info(`App listening on port ${port}`);
  await connect();

  routes(app);
});
