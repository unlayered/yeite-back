import "./startup/env.js";
import config from "config";
import express from "express";
import cors from "cors";
import winston from "winston";

import configure from './startup/config.js'
import logging from './startup/logging.js'
import routes from './startup/routes.js'
import database from './startup/db.js'
import { addObjectIdValidator } from "./startup/validation.js"

configure();

const app = express();
app.use(cors());

logging();
routes(app);
database();
addObjectIdValidator();

app.listen(config.get("port"), () => {
  winston.info(`App listening on port ${config.get("port")}`);
});
