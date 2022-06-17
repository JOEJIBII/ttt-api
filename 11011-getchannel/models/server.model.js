const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
module.exports.getchannel = (body,payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('channel')
            .aggregate([
                {
                    $project:{
                        _id:1,
                            channel:"$channel",
                    }
                }
                
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}
