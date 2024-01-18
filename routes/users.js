const auth = require("../middleware/auth.js");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User, validate } = require("../models/User.js");

const debug = require("debug")("app:users");

router.get("/", async (req, res) => {
  console.log(req.body);
  const user = await User.find().sort({ name: 1 });
  res.send(user);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
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

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send("The genre was not found");
  res.send(user);
});

module.exports = router;
