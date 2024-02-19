import auth from "../middleware/auth.js";
import _ from "lodash";
import express from "express";
import mongoose from "mongoose";
import { Track, validatePost, validatePut } from "../models/Track.js";

import debug from "debug";
debug("app:users");

const router = express.Router();

router.get("/", async (req, res) => {
  const tracks = await Track.find().populate('audio').populate('author');
  res.status(200).send({ total: tracks.length, items: tracks });
});

router.get("/me", auth, async (req, res) => {
  const tracks = await Track.find({author: req.user._id}).populate('audio').populate('author');
  if (!tracks) return res.status(404).send("The track was not found");
  res.send(tracks);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('The id is invalid.')
  const track = await Track.findById( req.params.id ).populate('audio').populate('author');
  if (!track) return res.status(404).send("The track was not found");
  res.send(track);
});

router.get("/author/:id", auth, async (req, res) => {
  const tracks = await Track.find({author: req.params.id}).populate('audio').populate('author');
  if (!tracks) return res.status(404).send("The track was not found");
  res.send(tracks);
});

router.post("/", auth, async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const track = new Track(
    _.pick(req.body, ["title", "metadata", "audio"])
  )
  track.author = req.user._id;
  await track.save();

  res.send(track);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validatePut(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const track = await Track.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, ["title", "metadata"]),
    { new: true }
  ).populate('audio');

  if (!track) return res.status(404).send("The track was not found");
  res.send(track);
});

router.delete("/:id", auth, async (req, res) => {
  const track = await Track.findByIdAndRemove(req.params.id);
  if (!track) return res.status(404).send("The track was not found");
  res.send(track);
});

export default router;
