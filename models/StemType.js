import Joi from "joi";
import mongoose from "mongoose";

const StemTypeSchema = new mongoose.Schema({
    name : {
        type: String,
        minLength: 5,
        maxLength: 32,
        required: true
    },
    type : {
        type: String,
        minLength: 5,
        maxLength: 32,
        required: true
    }
});

const StemType = mongoose.model("stems", StemTypeSchema);

function validate( stemType ) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(32).required(),
        type: Joi.string()
    });

    return schema.validate(stemType, {allowUnknown: true});
}

export {
    validate,
    StemTypeSchema,
    StemType
}
