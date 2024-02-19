import auth from "../middleware/auth.js";
import _ from "lodash";
import express from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import { AudioModel, validate } from "../models/Audio.js";

import debug from "debug";
import s3 from "../startup/s3.js";
import { getAudios } from "../services/AudioService.js";
debug("app:users");

const router = express.Router();

router.get("/", async (req, res) => {
  const {page = 1, limit = 10} = req.query;
  const audios = await getAudios( page, limit );

  res.status(200).send({ page, limit, count: audios.length, data : audios});
});

router.get("/me", auth, async (req, res) => {
  const audios = await AudioModel.find({author: req.user._id});
  if (!audios) return res.status(404).send("The user was not found");
  res.send({ total: audios.length, items: audios });
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('The id is invalid.')
  const audio = await AudioModel.findById( req.params.id ).populate('author', ['-password', '-isAdmin']);
  if (!audio) return res.status(404).send("The audio was not found");
  res.send(audio);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const uploadUrl = await s3.generateUploadURL(crypto.randomBytes(12).toString('hex') , 'audio', 'yeite-original-audio');

  const getUrl = uploadUrl.split('?')[0];

  const audio = new AudioModel(
    { ..._.pick(req.body, ["name", "stems", "bpm", "extension"]), url: getUrl }
  )

  audio.author = req.user._id;
  await audio.save();

  res.send({ result : audio , upload_url: uploadUrl});
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const audio = await AudioModel.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, ["name", "bpm"]),
    { new: true }
  );

  if (!audio) return res.status(404).send("The audio was not found");
  res.send(audio);
});

router.delete("/:id", auth, async (req, res) => {
  const audio = await AudioModel.findByIdAndRemove(req.params.id);
  if (!audio) return res.status(404).send("The audio was not found");
  res.send(audio);
});

export default router;
