import { Model } from "mongoose";

/**
 * 
 * @param {Model} model 
 * @param {} matching
 * @param {Number} page 
 * @param {Number} limit 
 */
export async function getPaginatedDocuments( model, stages, page, limit ){
    return await model.aggregate([
        ...stages,
        {
            $facet : {
                metadata : [
                    {
                        $count : 'total',
                    }
                ],
                data: [
                    {
                        $skip: (page  - 1) * limit
                    },
                    {
                        $limit: limit
                    }
                ]
            }
        },
        {
            $project: { 
                total: { $arrayElemAt: [ '$metadata.total', 0 ] },
                count: { $size: '$data' },
                pageNumber: { $literal: page },
                totalPages:{ $ceil : { $divide: [{$arrayElemAt: [ '$metadata.total', 0 ]}, limit] } }, 
                data: 1,                
            }
        }
       ]
    )
}

