const { MongoDB } = require('../configs/connection_mongodb');
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const today = dayjs();
const moment = require('moment');
//const collectionmember = "member"
const collectionCONFIGURATION = "configuration"
const collectionhistory_log_api = "history_log_api"
module.exports.getbankauto = (agent_id) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent_bank_account')
        .aggregate([
            {
                $match: {
                    $and: [
                        { agent_id: ObjectId(agent_id) },
                        {
                            $or: [
                                { bank_auto_config: { $ne: null } },
                                { sms_auto_config: { $ne: null } }
                            ]
                        }
        
                    ]
                }
            },
            {
                $lookup: {
                    from: 'bank',
                    localField: 'bank_id',
                    foreignField: '_id',
                    as: 'b'
                }
            },
            {
                $unwind: { path: '$b', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 0,
                    account_id: "$_id",
                    agent_id: "$agent_id",
                    type: "$type",
                    sub_type: "$sub_type",
                    bank: {
                        bank_id: "$bank_id",
                        bank_code: "$b.code",
                        bank_nameth: "$b.nameth",
                        bank_nameen: "$b.nameen",
                        account_number: "$account_number",
                        account_name: "$account_name",
                        //balance: "$balance",
                        // alive_bank_auto: "alive_bank_auto",
                    },
                    balance: { $ifNull: ['$balance', null] },
                    alive_bank_auto: "$alive_bank_auto",
                    bank_auto_status: "$bank_auto_status",
                    alive_sms_auto: "$alive_sms_auto",
                    sms_auto_status: "$bank_auto_status"
                }
            },
            {
                $lookup: {
                    from: 'agent',
                    localField: 'agent_id',
                    foreignField: '_id',
                    as: 'a'
                }
            },
            {
                $unwind: { path: '$a', preserveNullAndEmptyArrays: true }
            }, {
                $project: {
                    _id: 0,
                    account_id: "$_id",
                    agent_id: "$agent_id",
                    web_name: "$a.name",
                    web_prefix: "$a.prefix",
                    type: "$type",
                    sub_type: "$sub_type",
                    bank: "$bank",
                    balance: { $ifNull: ['$balance', null] },
                    alive_bank_auto: "$alive_bank_auto",
                    bank_auto_status: "$bank_auto_status",
                    alive_sms_auto: "$alive_sms_auto",
                    sms_auto_status: "$bank_auto_status"
                }
            },
        
        
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}




module.exports.findConF = (body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionCONFIGURATION)
            .aggregate([
                {
                    $match: {
                        $and: [
                            //{ou_id : ObjectId(payload.ou)},
                            //{branch_id : ObjectId(payload.branch)},
                            { domain_name: body.domain_name }
                        ]
                    }
                },

            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}