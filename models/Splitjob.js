import mongoose from "mongoose";
import Joi from "joi";

const SplitJobSchema = new mongoose.Schema({
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
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
}, {timestamps: true});

const Splitjob = mongoose.model("splitjobs", SplitJobSchema);

function validate(splitjob) {
  const schema = Joi.object({
    //status: Joi.string().min(3).max(50).required(),
    //inputUrl: Joi.string().uri().max(50).required(),
    //outputUrl: Joi.string().uri().max(50).required(),
    stems: Joi.number().min(2).max(5).required(),
    audio: Joi.objectId()
  });
  return schema.validate(splitjob);
}

export {
  SplitJobSchema,
  Splitjob,
  validate
}
