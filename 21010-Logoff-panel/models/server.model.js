const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ObjectId } = require('mongodb');




module.exports.remove_session = async (_id) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('emp_session').deleteMany({
            employee_id: ObjectId(_id)
        }
        )
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.find_session = (_id) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('emp_session').aggregate([
            {
                $match: {
                    $and: [

                        { employee_id: ObjectId(_id) }

                    ]
                }
            },
            {
                $project: {
                    _id: 1
                }
            }
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

