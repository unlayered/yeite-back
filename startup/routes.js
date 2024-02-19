import express from "express";

import users from "../routes/users.js";
import auth from "../routes/auth.js";
import audio from "../routes/audio.js";
import track from "../routes/track.js";
import stem from "../routes/stem.js";
import split from "../routes/split.js";

import errorLogs from "../middleware/error.js";
import paginate from "../middleware/paginate.js";

export default function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  // PAGINATION
  app.use(paginate);

  app.use("/api/users", users);
  app.use("/api/audio", audio);
  app.use("/api/track", track);
  app.use("/api/auth", auth);
  app.use("/api/stem", stem);
  app.use("/api/split", split);

  /* ERROR HANDLING MIDDLEWARE*/
  app.use(errorLogs);
};
