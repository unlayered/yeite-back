const config = require("config");
const winston = require("winston");
require("express-async-errors");
require("winston-mongodb");

module.exports = function () {
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );

  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  /*   winston.rejections.handle(
    new winston.transports.File({ filename: "rejections.log" })
  ); */
};
