const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');

const { ObjectId } = require('mongodb');
module.exports.getprefix = (agent_id) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent')
            .aggregate([
                {
                    $match: {
                        $and: [
                            { _id: ObjectId(agent_id) },
                        ]
                    }
                },

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

module.exports.getagent_id = (user_id) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('employee')
            .aggregate([

                {
                    $match: {
                        $and: [
                            { _id: ObjectId(user_id) },
                        ]
                    }
                },{
                    $project: {
                        _id: 1,
                       agent_id : "$pool.agent_pool"
                    }
                }

            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}
