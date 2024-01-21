import Joi from 'joi'


const schema = Joi.array().items(
  Joi.object(
    { 
      name: Joi.string().required(),
      title: Joi.string()
    }
  ))

const inners = schema["$_terms"].items

if (schema.describe().type === "array" ) {
    Joi.array.items().fork( [], (s) => {console.log(s); return s.optional()})
}

const {error, value} = fork.validate([{title: "Julio"}])
console.log(error.details[0].message)