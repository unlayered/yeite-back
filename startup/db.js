const config = require("config");
const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  mongoose
    .set("strictQuery", false)
    .connect(config.get("database-uri"))
    .then(() => winston.info("Connected to MongoDB"))
    .catch((err) => {
      console.log("Could not connect to db");
      console.error(err);
    });
};
