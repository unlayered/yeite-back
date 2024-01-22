import "./startup/env.js";
import config from "config";
import https from "https";
import fs from "fs";
import express from "express";
import cors from "cors";
import winston from "winston";
import path from "path";
import debug from "debug"

import configure from './startup/config.js'
import logging from './startup/logging.js'
import routes from './startup/routes.js'
import database from './startup/db.js'
import joiUtils from "./startup/validation.js"

// SAFECHECK CONFIGURACIONES NECESARIAS
configure();

const app = express();

// app.use(
//   "/output",
//   express.static(config.get("outputPath"), {
//     setHeaders: function (res, path, stat) {
//       res.set("Access-Control-Allow-Origin", "*");
//     },
//   })
// );

app.use(cors());

logging();
routes(app);
database();
joiUtils();

app.listen(config.get("port"), () => {
  winston.info(`App listening on port ${config.get("port")}`);
});
