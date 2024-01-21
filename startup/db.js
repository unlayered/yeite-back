import config from "config";
import mongoose from "mongoose";
import winston from "winston";

export default function () {
  mongoose
    .set("strictQuery", false)
    .connect(config.get("database-uri"))
    .then((res) => {winston.info("Connected to MongoDB")})
    .catch((err) => {
      console.log("Could not connect to db");
      console.error(err);
    });
};
