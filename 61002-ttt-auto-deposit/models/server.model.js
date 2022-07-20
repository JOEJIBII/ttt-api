const { MongoDB } = require('../build/mongodb')
const { ObjectId } = require('mongodb')
const moment = require('moment');

module.exports.getBankTransaction = () => {
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection('bank_transaction')
            .aggregate([{
                $match: {
                    $and: [{ type: 'deposit' }, { channel: { $ne: 'ATM' } }, { status: 'pending' }]
                }
            }, {
                $lookup: {
                    from: 'bank',
                    localField: 'bank_id',
                    foreignField: '_id',
                    as: 'db'
                }
            }, {
                $unwind: { path: '$db', preserveNullAndEmptyArrays: true }
            }, {
                $lookup: {
                    from: 'bank',
                    localField: 'from_bank_id',
                    foreignField: 'code',
                    as: 'mb'
                }
            }, {
                $unwind: { path: '$mb', preserveNullAndEmptyArrays: true }
            }, {
                $project: {
                    _id: '$_id',
                    agent_id: '$agent_id',
                    d_code: { $ifNull: ['$db.code', 'noti'] },
                    d_bank: { $ifNull: ['$bank_id', null] },
                    d_account: { $ifNull: ['$account_id', null] },
                    d_oth_account: { $ifNull: ['$to_account_number', null] },
                    date: '$date',
                    time: '$time',
                    amount: '$amount',
                    // m_code: '$mb.code', { $ifNull: ['$mb.code', 'noti'] },
                    m_code: { $ifNull: ['$mb.code', 'noti'] },
                    m_bank: '$mb._id',
                    m_no: '$from_account_number',
                    m_name: '$from_account_name'
                }
            }, {
                $sort: { _id: 1 }
            }, {
                $limit: 1
            }])
            .toArray()
            .then(result => resolve(result))
            .catch(error => reject(error))
    })
}

module.exports.SCB2SCB = (agentId, bankId, no, name) => {
    return new Promise(async (resolve, reject) => {
        const rNo = new RegExp((no).replace('x', '') + '$');
        //const rName = new RegExp('^' + name);
        const rName = new RegExp(name);
        await MongoDB
            .collection('memb_bank_account')
            .aggregate([{
                $match: {
                    $and: [{ agent_id: ObjectId(agentId) }, { bank_id: ObjectId(bankId) }, { account_number: { $regex: rNo } }, { account_name: { $regex: rName } }]
                }
            }, {
                $lookup: {
                    from: 'member',
                    localField: 'memb_id',
                    foreignField: '_id',
                    as: 'm'
                }
            }, {
                $unwind: { path: '$m' }
            }, {
                $project: {
                    memb_id: '$m._id',
                    from_bank_id: '$bank_id',
                    from_account_id: '$_id'
                }
            }])
            .toArray()
            .then(result => resolve(result))
            .catch(error => reject(error))
    })
}

module.exports.KBANK2KBANK = (agentId, bankId, no) => {
    return new Promise(async (resolve, reject) => {
        //const rNo = new RegExp((no).replace('x', '') + '$');
        const rNo = new RegExp((no).replace('x', ''));
        await MongoDB
            .collection('memb_bank_account')
            .aggregate([{
                $match: {
                    $and: [{ agent_id: ObjectId(agentId) }, { bank_id: ObjectId(bankId) }, { account_number: { $regex: rNo } }]
                }
            }, {
                $lookup: {
                    from: 'member',
                    localField: 'memb_id',
                    foreignField: '_id',
                    as: 'm'
                }
            }, {
                $unwind: { path: '$m' }
            }, {
                $project: {
                    memb_id: '$m._id',
                    from_bank_id: '$bank_id',
                    from_account_id: '$_id'
                }
            }])
            .toArray()
            .then(result => resolve(result))
            .catch(error => reject(error))
    })
}

module.exports.SCB2OTH = (agentId, bankId, no) => {
    return new Promise(async (resolve, reject) => {
        const rNo = new RegExp((no))
        await MongoDB
            .collection('memb_bank_account')
            .aggregate([{
                $match: {
                    $and: [{ agent_id: ObjectId(agentId) }, { bank_id: ObjectId(bankId) }, { account_number: { $regex: rNo } }]
                }
            }, {
                $lookup: {
                    from: 'member',
                    localField: 'memb_id',
                    foreignField: '_id',
                    as: 'm'
                }
            }, {
                $unwind: { path: '$m' }
            }, {
                $project: {
                    memb_id: '$m._id',
                    from_bank_id: '$bank_id',
                    from_account_id: '$_id'
                }
            }])
            .toArray()
            .then(result => resolve(result))
            .catch(error => reject(error))
    })
}

module.exports.findaccount_agent = (agentId, bankId, no) => {
    return new Promise(async (resolve, reject) => {
        //const rNo = new RegExp((no).replace('/x', '') + '$');
        const rNo = new RegExp((no).replace('/x', ''));
        await MongoDB
            .collection('agent_bank_account')
            .aggregate([{
                $match: {
                    $and: [{ agent_id: ObjectId(agentId) }, { bank_id: ObjectId(bankId) }, { account_number: { $regex: rNo } }]
                }
            },
            {
                $project: {
                    to_bank_id: '$bank_id',
                    to_account_id: '$_id'
                }
            }
            ])
            .toArray()
            .then(result => resolve(result))
            .catch(error => reject(error))
    })
}

module.exports.insertDeposit = data => {
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection('deposit')
            .insertOne(data)
            .then(result => resolve(result))
            .catch(error => reject(error))
    })
}

module.exports.updateTxS = (_id, status) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection('bank_transaction')
            .updateOne({
                _id: ObjectId(_id)
            }, {
                $set: {
                    status: status,
                    upd_by: 'auto deposit api',
                    upd_date: new Date()
                }
            })
            .then(result => resolve(result))
            .catch(error => reject(error))
    })
}

module.exports.getconfig_pd = (agent_id) => {
    // console.log(body);
    return new Promise(async (resolve, reject) => {

        await MongoDB.collection('agent')

            .aggregate([
                {
                    $match: {
                        $and: [
                            //{ou_id : ObjectId(payload.ou)},
                            //{branch_id : ObjectId(payload.branch)},
                            {
                                _id: ObjectId(agent_id)
                            },

                        ]
                    }
                },
                {
                    $project: {
                        id: 1,
                        prov_key: "$provider.prov_key",
                        prov_prefix: "$provider.prov_prefix",
                        prov_domain: "$provider.prov_domain",
                        prov_agentusername: "$provider.prov_agentusername",
                        prov_whitelabel: "$provider.prov_whitelabel",

                    }
                },

            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.findmember_username = (memb_id) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member_provider_account')
            .aggregate([
                {
                    $match: {
                        $and: [
                            {
                                memb_id: ObjectId(memb_id)
                            },

                        ]
                    }
                }, {
                    $project: {
                        _id: 1,
                        memb_id: "$memb_id",
                        username: "$username",
                    }
                },
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.updaterefid = (doc_id, ref_id) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('deposit')
            .updateOne({
                _id: ObjectId(doc_id)
            }, {
                $set: {
                    "ref_id": ObjectId(ref_id),
                    "upd_by": "auto-deposit",
                    "upd_date": new Date(moment().format()),
                    "upd_prog": "auto-deposit"
                }
            }, { upsert: true }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}