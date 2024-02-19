import mongoose from "mongoose";
import Joi from "joi";

const SplitSchema = new mongoose.Schema({
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: false
  },
  audio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'audios',
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "started", "processed", "failed"],
    default: "pending",
    required: true,
  },
  stems: {
    type: Number,
    required: true,
    min: 2,
    max: 5
  },
  codec: {
    type: String,
    enum: ["mp3", "wav", "m4a"],
  },
  bitrate: {
    type: String,
    enum: ["320k"]
  }
}, {timestamps: true});

const SplitModel = mongoose.model("splitjobs", SplitSchema);

function validate( splitJob ){
    const splitJobSchema = Joi.object({
        audioId: Joi.string().min(5).max(255).required(),
        stems : Joi.number().required(),
        codec : Joi.string(),
        bitrate : Joi.string().valid('320k'),
    })

    return splitJobSchema.validate( splitJob );
}

export {
  SplitSchema,
  SplitModel,
  validate
}
