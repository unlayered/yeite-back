import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import express from "express";
import { User, validate } from "../models/User.js";

import debug from "debug";
debug("app:users");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.send({ total: users.length, items: users });
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).send("The user was not found");
  res.send(user);
});

router.get("/:id", [auth, admin], async (req, res) => {
  const user = await User.findById(req.params.id).select("-password")
  if (!user) return res.status(404).send("The user was not found");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const registeredUser = await User.findOne({ email: req.body.email });
  if (registeredUser)
    return res.status(400).send("User already registered with that email");

  const user = new User(
    _.pick(req.body, ["name", "email", "password", "isAuth"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, email: req.body.email, password: req.body.password },
    { new: true }
  );

  if (!user) return res.status(404).send("The user was not found");
  res.send(user);
});

router.delete("/me", auth, async (req, res) => {
  const user = await User.findByIdAndRemove(req.user._id);
  if (!user) return res.status(404).send("The user was not found");
  res.send(user);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send("The user was not found");
  res.send(user);
});

export default router;
