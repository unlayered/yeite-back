import Joi from "joi";
import mongoose from "mongoose";

const HintSchema = new mongoose.Schema({
    bar_start: {
        type: Number,
        min: 0,
    },
    bar_end: {
        type: Number,
        min: 0,
    },
    title: {
        type: String,
        minLength: 5,
        maxLength: 255,
    },
    tempo: {
        type: Number,
        min: 0
    },
    description: {
        type: String,
        minLength: 5,
        maxLength: 255,
    },
    type: { 
        type: {
            type: String,
            enum: ["Counter", "Text", "Score"],
            required: true,
        }
    }
  });

const SectionSchema = new mongoose.Schema({
    bar_start: {
        type: Number,
        min: 0,
    },
    bar_end: {
        type: Number,
        min: 0,
    },
    title: {
        type: String,
        minLength: 5,
        maxLength: 255,
    },
    time_signature: String,
    tempo: {
        type: Number,
        min: 0
    },
    hints: [HintSchema],
    layer : {
        type: String,
        enum: ["Drums", "Vocals", "Guitars", "Keyboard", "Bass"],
    },
})

const TrackMetadataSchema = new mongoose.Schema({
    sections: [SectionSchema],
    tempo: Number,
    time_signature: String
})

const TrackSchema = new mongoose.Schema({
    audio : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'audios',
        required: true,
    },
    title: {
        type:String,
        required: true,
        minLength: 1,
        maxLength: 255,
        trim:true,
    },
    author : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
    metadata : TrackMetadataSchema
});

const Track = mongoose.model("tracks", TrackSchema);


function validatePost(audio) {
  const schema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        audio: Joi.string().min(16).required()
    });
  return schema.validate(audio, {allowUnknown: true});
}

function validatePut(audio) {
    const schema = Joi.object({
          title: Joi.string().min(2).max(255).required(),
          audio: Joi.string().min(16).required()
      });
    return schema.validate(audio, {allowUnknown: true});
  }

export {
    validatePost,
    validatePut,
    TrackSchema,
    Track
}
