import auth from "../middleware/auth.js";
import mongoose from "mongoose";
import _ from "lodash";
import express from "express";
import { SplitModel, validate } from "../models/Split.js";
import { AudioModel } from "../models/Audio.js";

import axios from 'axios'

const router = express.Router();

router.get('/', auth, async (req,res) => {
  const splits = await SplitModel.find();
  res.status(200).send({ total: splits.length, items: splits });
})

router.post('/status', async(req,res) => {
  const { success, result } = req.body;

  const { split_job, status, stems } = result;

  const split = await SplitModel.findById(split_job);
  split.status = status;
  await split.save();

  if (success){
    const audio = await AudioModel.findByIdAndUpdate( split.audio );
    const stemList = stems.map( url => {
      
      const layer = url
        .split("/")
        .pop() //KEEP THE FILENAME + EXTENSION
        .replace( /.*_/g, "") //DROP ANYTHING BEFORE LOW DASH
        .replace( /\..{1,5}$/g, "") //DROP EXTENSION

      return {
        url : url,
        //layer: layer
      }
    });

    audio.stems = stemList;
    await audio.save();  
  }
  
  res.status(200);
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

  try {
    const { data } = await axios.post( 'http://192.168.0.198:3001/split', {
      split_job: split._id,
      fileUrl: audio.url,
      stems: stems,
      bitrate: bitrate,
      codec: codec
    })
    
    console.log(data)
    await split.save();

  } catch (err){
    res.status(500).send(err.message)
  }

  res.status(202).send(split)
})

router.delete('/:id', auth, async (req,res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('The id is invalid.')
  
  const splitJob = await SplitModel.findByIdAndRemove( req.params.id );
  if (!splitJob) return res.status(404).send("Split not found");
  res.send(splitJob);
})

export default router;