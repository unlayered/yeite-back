import winston from "winston";
import "express-async-errors";
import "winston-mongodb";

export default function () {
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
