import auth from "../middleware/auth.js";
import _ from "lodash";
import express from "express";
import mongoose from "mongoose";
import { Audio, validateAudio } from "../models/Audio.js";

import debug from "debug";
debug("app:users");

const router = express.Router();

router.get("/", async (req, res) => {
  const audios = await Audio.find().populate('author', ['-password', '-isAdmin']).sort({ name: 1 });
  res.status(200).send({ total: audios.length, items: audios });
});

router.get("/me", auth, async (req, res) => {
  const audios = await Audio.find({author: req.user._id});
  if (!audios) return res.status(404).send("The user was not found");
  res.send({ total: audios.length, items: audios });
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('The id is invalid.')
  const audio = await Audio.findById( req.params.id ).populate('author', ['-password', '-isAdmin']);
  if (!audio) return res.status(404).send("The user was not found");
  res.send(audio);
});

router.get("/author/:id", auth, async (req, res) => {
  const audios = await Audio.find({author: req.params.id});
  if (!audios) return res.status(404).send("The user was not found");
  res.send({ total: audios.length, items: audios });
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const audio = new Audio(
    _.pick(req.body, ["name", "stems", "bpm"])
  )
  audio.author = req.user._id;
  await audio.save();

  res.send(audio);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const audio = await Audio.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, ["name", "bpm"]),
    { new: true }
  );

  if (!audio) return res.status(404).send("The audio was not found");
  res.send(audio);
});

router.delete("/:id", auth, async (req, res) => {
  const audio = await Audio.findByIdAndRemove(req.params.id);
  if (!audio) return res.status(404).send("The audio was not found");
  res.send(audio);
});

export default router;
