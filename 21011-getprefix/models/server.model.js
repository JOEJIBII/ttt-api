const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');

const { ObjectId } = require('mongodb');
module.exports.getprefix = () => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent')
            .aggregate([

                {
                    $project: {
                        _id: 1,
                        name: "$name",
                        status: "$status",
                        domain_name: "$domain_name"
                    }
                }

            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}
