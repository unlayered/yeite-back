const dotenv = require("dotenv");
dotenv.config();
const config = require("config");
const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const winston = require("winston");
const path = require("path");
const debug = require("debug")("app:startup");

// SAFECHECK CONFIGURACIONES NECESARIAS
require("./startup/config")();

const app = express();
app.use(
  "/output",
  express.static(config.get("outputPath"), {
    setHeaders: function (res, path, stat) {
      res.set("Access-Control-Allow-Origin", "*");
    },
  })
);
app.use(cors());

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
//require("./startup/validation")();

app.listen(config.get("port"), () => {
  winston.info(`App listening on port ${config.get("port")}`);
});
