import { paginationSchema } from "../startup/validation.js";

export default function (req,res, next){
    const {error} = paginationSchema.validate( req.query , {allowUnknown: true});
    
    if (error) 
        return res.status(400).send(error.details[0].message)

    next();
}