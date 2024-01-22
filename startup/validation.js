import Joi from "joi";
import objectId from "joi-objectid";

export default function () {
  Joi.objectId = objectId(Joi);
};

export function makeSchemaFieldsOptional( schema ){
  if (schema.describe().type === 'object')
      return schema.fork( Object.keys(schema.describe().keys), makeSchemaFieldsOptional );
  if (schema.describe().type === 'array'){
      const innerFields = schema["$_terms"].items

      //ALTER EVERY FIELD
      const newSchemas = innerFields.map( makeSchemaFieldsOptional );

      //RETURNS A NEW ARRAY SCHEMA
      return Joi.array().items(...newSchemas);
  }
  return schema.optional();
}