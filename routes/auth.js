import _ from "lodash";
import Joi from "joi";
import bcrypt from "bcrypt";
import express from "express";
import { User } from "../models/User.js";

import debug from "debug";
debug("app:auth");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.send({ "auth-token" : token });
});

function validateLogin(req) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}


export default router;
