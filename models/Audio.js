import Joi from "joi";
import mongoose from "mongoose";

const StemSchema = new mongoose.Schema({
  layer : {
    type: String,
    enum: ["Drums", "Vocals", "Guitars", "Keyboard", "Bass"],
    required: true
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
    required: false,
    minlength: 5,
    maxlength:255,
    trim: true
  },
  stems : [StemSchema],
  bpm : {
    type: Number,
    min: 0,
  },
  author : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  }]
});

const Audio = mongoose.model("audios", AudioSchema);

function validateAudio(audio) {

  const stemSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    url: Joi.string().dataUri().min(5).max(255).required()
  })

  const audioSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    url: Joi.string().dataUri().min(5).max(255),
    stems: Joi.array().items( stemSchema ),
    bpm: Joi.number().min(0),
  });
  return audioSchema.validate(audio);
}

export {
  validateAudio,
  AudioSchema,
  Audio
}
