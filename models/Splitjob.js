const mongoose = require("mongoose");
const Joi = require("joi");

const splitjobSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 255 },
  timestamp: { type: String, required: true, minlength: 1, maxlength: 255 },
  status: { type: String, required: true, minlength: 1, maxlength: 255 },
  stems: { type: Number, required: true, min: 2, max: 5 },
  offset: { type: Number, required: false, min: 0, default: 0 },
  duration: { type: Number, required: false, min: 0 },
});

const Splitjob = mongoose.model("Splitjob", splitjobSchema, "Notify");

function validateSplitjob(splitjob) {
  const schema = Joi.object({
    //status: Joi.string().min(3).max(50).required(),
    //inputUrl: Joi.string().uri().max(50).required(),
    //outputUrl: Joi.string().uri().max(50).required(),
    name: Joi.string().min(1).max(50).required(),
    stems: Joi.number().min(2).max(5).required(),
    file: Joi.required(),
  });
  return schema.validate(splitjob);
}

exports.splitjobSchema = splitjobSchema;
exports.Splitjob = Splitjob;
exports.validate = validateSplitjob;
