import Joi from "joi";
import mongoose from "mongoose";

const StemSchema = new mongoose.Schema({
  layer : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'stemTypes',
  },
  url: {
    type: String,
    minLength: 5,
    maxLength : 255,
    trim: true,
    required: true
  }
});

const AudioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
    trim: true,
  },
  url: {
    type: String,
    minlength: 5,
    maxlength:255,
    trim: true
  },
  stems : [StemSchema],
  bpm : {
    type: Number,
    min: 0,
  },
  author : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  extension: {
    type: String,
  }
});

const AudioModel = mongoose.model("audios", AudioSchema);

function validate(audio) {

  const stemSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    url: Joi.string().dataUri().min(5).max(255).required()
  })

  const audioSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    url: Joi.string().dataUri().min(5).max(255),
    stems: Joi.array().items( stemSchema ),
    bpm: Joi.number().min(0),
    extension: Joi.string().valid('mp3', 'wav', 'm4a'),
  });

  return audioSchema.validate(audio, {allowUnknown : true});
}

export {
  validate,
  AudioSchema,
  AudioModel
}
