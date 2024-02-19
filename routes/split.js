import auth from "../middleware/auth.js";
import mongoose from "mongoose";
import _ from "lodash";
import express from "express";
import { SplitModel, validate } from "../models/Split.js";
import { AudioModel } from "../models/Audio.js";

import axios from 'axios'
import config from 'config'

import http from 'http';

const router = express.Router();

router.get('/', auth, async (req,res) => {
  const splits = await SplitModel.find();
  res.status(200).send({ total: splits.length, items: splits });
})

router.post('/test', async(req,res) => {
  const contents =  req.body.success;
  console.log(contents);
  res.status(200).send('OK')
})

router.get('/:id', auth, async (req,res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('The id is invalid.')
  const split = await SplitModel.findById( req.params.id ).populate('user', ['-password', '-isAdmin']).populate('audio');
  if (!split) return res.status(404).send("Split not found");
  res.send(split);
})

router.post('/', auth, async (req,res) => {
  const {error} = validate( req.body );
  if (error) return res.status(400).send(error.details[0].message);
  
  const { audioId, stems, codec = 'mp3', bitrate = "320k" } = req.body;

  const audio = await AudioModel.findById(audioId);
  
  if (!audio)
    return res.status(404).send("The audio does not exist.");

  const split = new SplitModel(
    { ..._.pick(req.body, ["stems", "codec", "bitrate"]) }
  )

  split.audio = audio._id;
  split.user = req.user._id;
  await split.save();

  try {
    const { data } = await axios.post( 'http://192.168.0.198:3001/split', {
      fileUrl: audio.url,
      stems: stems,
      bitrate: bitrate,
      codec: codec
    })

    console.log(data)
  } catch (err){
    res.status(500).send(err.message)
  }

  res.status(200).send(split)
})

router.delete('/:id', auth, async (req,res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('The id is invalid.')
  
  const splitJob = await SplitModel.findByIdAndRemove( req.params.id );
  if (!splitJob) return res.status(404).send("Split not found");
  res.send(splitJob);
})

export default router;