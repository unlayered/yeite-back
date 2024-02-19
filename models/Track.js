import Joi from "joi";
import mongoose from "mongoose";
import { makeSchemaFieldsOptional } from "../startup/validation.js";

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
        maxLength: 1024,
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

const hintSchema = Joi.object({
    bar_start: Joi.number().min(0).required(),
    bar_end: Joi.number().required(),
    title: Joi.string().min(2).max(255).required(),
    tempo: Joi.number().min(0),
    description: Joi.string().min(5).max(1024),
    type: Joi.string().valid('counter', 'text', 'score').required()
});

const sectionSchema = Joi.object({
    bar_start: Joi.number().min(0).required(),
    bar_end: Joi.number().required(),
    title: Joi.string().min(2).max(255).required(),
    time_signature: Joi.string().required(),
    tempo: Joi.number().min(0),
    hints: Joi.array().items( hintSchema ),
    layer: Joi.string().valid("drums", "vocals", "guitars", "keyboard")
});

const metadataSchema = Joi.object({
    tempo: Joi.number().min(0).required(),
    time_signature: Joi.string().required(),
    sections: Joi.array().items( sectionSchema )
});

const trackSchema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    audio: Joi.string().min(16).required(),
    metadata: metadataSchema
});

function validatePost(track) {
    return trackSchema.validate(track, {allowUnknown: true});
}

function validatePut(track) {
    const schema = makeSchemaFieldsOptional(trackSchema);
    return schema.validate(track, {allowUnknown: true});
}

export {
    validatePost,
    validatePut,
    TrackSchema,
    Track
}
