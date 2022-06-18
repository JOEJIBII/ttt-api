const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
module.exports.getstatus = (body,payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('status')
            .aggregate([
                
                {
                    $project:{
                        _id:1,
                        status:"$status",
                        status_th:"$status_th",
                        description:"$description"
                    }
                }
                
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}
