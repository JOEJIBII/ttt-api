const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
module.exports.getprivilege = (body,payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent')
            .aggregate([
                {
                    $match: {
                        $and: [{
                            _id: ObjectId("629e381cb4839cabb5622da1")
                        },]
                    }
                },
                {
                    $project:{
                        _id:1,
                        privilege:"$privilege",
                    }
                }
                
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}
