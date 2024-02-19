import mongoose from 'mongoose';
import { AudioModel } from '../models/Audio.js';
import { getPaginatedDocuments } from '../models/Pagination.js';

async function getAudios( page = 1, limit = 10, authorId ){
    let filters = authorId ? {author: authorId} : {};

    return await AudioModel.find( )
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', ['-password', '-isAdmin'])
        .sort({ name: 1 })
}

async function getAudiosWithAggregation( page = 1, limit = 10, authorId ){
    let stages = [
        {
            $match : ( authorId ? { author : mongoose.Schema.Types.ObjectId(authorId) } : {}  )
        },
        {
            $lookup: {
                from: 'users', 
                localField: 'author',
                foreignField: '_id',
                as: 'author',
            }
        },
        {
            $unwind: '$author'
        }
    ]

    return  await getPaginatedDocuments(AudioModel, stages, Number(page), Number(limit));
};

async function getAudio( page = 0, limit = 10){
    await AudioModel.find()
}

export {
    getAudios,
    getAudio,
}