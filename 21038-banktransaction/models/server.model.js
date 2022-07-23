const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const { ObjectId } = require('mongodb');


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
                                }, {
                                        $project: {
                                                _id: 1,
                                                agent_id: "$pool.agent_pool"
                                        }
                                }

                        ]).toArray()
                        .then(result => resolve(result))
                        .catch(error => reject(error));


        });
}


module.exports.getbanktransaction = (account_id) => {
        // console.log(body);
        return new Promise(async (resolve, reject) => {

                await MongoDB.collection('bank_transaction')

                        .aggregate([
                                {
                                        $match: {
                                                $and: [{
                                                        account_id: ObjectId(account_id)
                                                },]

                                        }
                                },
                                // {
                                //     $lookup: {
                                //         from: 'bank',
                                //         localField: 'bank_id',
                                //         foreignField: '_id',
                                //         as: 'db'
                                //     }
                                // },
                                {
                                        $project: {
                                                account_id: "$account_id",
                                                date: "$cr_date",
                                                type: "$type",
                                                amount: "$amount",
                                                description: "$description"
                                        }
                                },

                        ])
                        .sort({ _id: -1 })
                        .toArray()
                        .then(result => resolve(result))
                        .catch(error => reject(error));
        });
}

module.exports.getbank = (account_id) => {
        // console.log(body);
        return new Promise(async (resolve, reject) => {

                await MongoDB.collection('agent_bank_account')

                        .aggregate([
                                {
                                        $match: {
                                                $and: [{
                                                        _id: ObjectId(account_id)
                                                },]

                                        }
                                },
                                {
                                        $lookup: {
                                                from: 'bank',
                                                localField: 'bank_id',
                                                foreignField: '_id',
                                                as: 'db'
                                        }
                                },
                                {
                                        $unwind: { path: '$db', preserveNullAndEmptyArrays: true }
                                },
                                {
                                        $project: {
                                                account_id: "$_id",
                                                account_number: "$account_number",
                                                account_name: "$account_name",
                                                bank: {
                                                        bank_id: "$db._id",
                                                        bank_code: "$db.code",
                                                        bank_nameen: "$db.nameen",
                                                        bank_nameth: "$db.nameth",
                                                }
                                        }
                                },

                        ])
                        .sort({ _id: -1 })
                        .toArray()
                        .then(result => resolve(result))
                        .catch(error => reject(error));
        });
}