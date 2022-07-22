const { MongoDB } = require('../configs/connection_mongodb');
// const objectId = require('mongodb').ObjectId;
const { ObjectId, Double, ObjectID } = require('mongodb');
const moment = require('moment');
const { withdraw } = require('../controllers/server.controller');
const collectionmember = "member"
const collectionCONFIGURATION = "configuration"
//const collectionhistory_log_api ="history_log_api"
module.exports.getwithdraw_config = (agent_id) => {
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
                }, {
                    $unwind: { path: "$withdraw_config" }
                },
                {
                    $project: {
                        id: 1,
                        counter: "$withdraw_config.counter",
                        min: "$withdraw_config.min_cash_limit",
                        max: "$withdraw_config.max_cash_limit",
                        // bank_account: "$agent_bank_account_withdraw",
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

module.exports.getbankweb = (body, agent_id) => {
    // console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent_bank_account')
            .aggregate([
                {
                    $match: {
                        $and: [
                            //{ou_id : ObjectId(payload.ou)},
                            //{branch_id : ObjectId(payload.branch)},
                            {
                                agent_id: ObjectId(agent_id)
                            },
                            {
                                _id: ObjectId(body.account_withdraw)
                            }

                        ]
                    }
                },
                {
                    $project: {
                        id: 1,
                        account_number: "$account_number",
                        account_name: "$account_name",
                        bank_id: "$bank_id",
                        sub_type:"$sub_type"
                    }
                },

            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.getbankweb_bonus = (agent_id) => {
    // console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent_bank_account')
            .aggregate([
                {
                    $match: {
                        $and: [
                            //{ou_id : ObjectId(payload.ou)},
                            //{branch_id : ObjectId(payload.branch)},
                            {
                                agent_id: ObjectId(agent_id)
                            },
                            {
                                type: "withdraw"
                            },
                            {
                                sub_type: "bonus"
                            }

                        ]
                    }
                },
                {
                    $project: {
                        id: 1,
                        account_number: "$account_number",
                        account_name: "$account_name",
                        bank_id: "$bank_id",
                        sub_type:"$sub_type"
                    }
                },

            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.findbankmemb = (id) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_bank_account')
            .aggregate([
                {
                    $match: {
                        $and: [
                            //{ou_id : ObjectId(payload.ou)},
                            //{branch_id : ObjectId(payload.branch)},
                            { memb_id: ObjectId(id) },
                            { status: "active" }
                        ]
                    }
                }, {
                    $project: {
                        id: 1,
                        // name:"$name",
                        memb_id: "$memb_id",
                        bank_id: "$bank_id",
                        account_name: "$account_name",
                        banking_account: "$account_number"

                    }
                }, {
                    $lookup: {
                        from: "member_provider_account",
                        localField: "memb_id",
                        foreignField: "memb_id",
                        as: "memb_pd"
                    }
                }, {
                    $unwind: { path: "$memb_pd", preserveNullAndEmptyArrays: true }
                },
                {
                    $project: {
                        id: 1,
                        // name:"$name",
                        memb_id: "$memb_id",
                        bank_id: "$bank_id",
                        account_name: "$account_name",
                        banking_account: "$account_number",
                        mem_pd: {
                            $cond: [{
                                $eq: [{ $ifNull: ["$memb_pd.username", null] }, null]
                            },
                                null,
                            {
                                memb_username: "$memb_pd.username",
                            }]
                        },

                    }
                },
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.checktrasaction = (agent_id, user_id) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('withdraw')
            .aggregate([
                {
                    $match: {
                        $and: [

                            {
                                agent_id: ObjectId(agent_id)
                            },
                            {
                                memb_id: ObjectId(user_id)
                            },
                            {
                                $or: [
                                    { status: "pending" }, { status: "check" }
                                ]
                            }
                        ]
                    }
                }
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.counttrasaction = (agent_id, memb_id) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('withdraw')
            .aggregate([
                {
                    $match: {
                        $and: [
                            {
                                agent_id: ObjectId(agent_id)
                            },
                            {
                                memb_id: ObjectId(memb_id)
                            },
                            { approve_date: { $gte: new Date(moment().format('YYYY-MM-DD')) } },
                            {from_bank_name:{$ne:"bonus"}}
                        ]
                    }
                }
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.counttrasaction_suceess = (agent_id, memb_id) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('withdraw')
            .aggregate([
                {
                    $match: {
                        $and: [
                            {agent_id: ObjectId(agent_id) },
                            {memb_id: ObjectId(memb_id)},
                            {approve_date: { $gte: new Date(moment().format('YYYY-MM-DD')) } },
                            {status:"success"},
                            {status : "failed"},
                            {status:"approve"},
                            {from_bank_name:{$ne:"bonus"}}
                        ]
                    }
                }
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.getagent_id = (memb_id) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member')
            .aggregate([
                {
                    $match: {
                        $and: [
                            {
                                _id: ObjectId(memb_id)
                            },
                        ]
                    }
                }
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.Withrawcount = (_id, counter) => {
    console.log(_id)
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember)
            .findOneAndUpdate(
                {
                    _id: ObjectId(_id)

                },

            )
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.getlastdeposit = (agent_id, memb_id) => {
    console.log(agent_id, memb_id)
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection("deposit")
            .aggregate([
                {
                    $match: {
                        $and: [
                            {
                                agent_id: ObjectId(agent_id)
                            },
                            {
                                memb_id: ObjectId(memb_id)
                            },
                        ]
                    }
                },
                {
                    $project: {
                        ref_id: "$ref_id"
                    }
                }
            ])
            .sort({ _id: -1 })
            .toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.Withrawcount = (_id, counter) => {
    console.log(_id)
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('withdraw')
            .findOneAndUpdate(
                {
                    _id: ObjectId(_id)

                },
                {
                    $inc: {
                        "financial.withdraw_count": counter
                    }
                },

            )
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.InsertDocWithdraw = (payload, balance, member, bankweb, notes, turnover, body, agent_id) => {
    console.log(payload)
    let silpimage = null
   let silpdate = null
   if(silpimage !== null && silpimage !== ""){
    silpimage = body.silp_image
   }
   if(body.transaction_date !== null && body.transaction_date !== ""){
    silpdate = new Date(moment(body.transaction_date).format())
   }
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('withdraw')
            .insertOne({
                agent_id: ObjectId(agent_id),
                channel:"panel",
                type: "withdraw",
                date: new Date(moment().format()),
                memb_id: ObjectId(member.memb_id),
                from_bank_id: ObjectId(bankweb.bank_id),
                from_account_id: ObjectId(bankweb._id),
                from_bank_name: bankweb.account_name,
                member_name: member.account_name,
                to_bank_id: ObjectId(member.bank_id),
                to_account_id: ObjectId(member._id),
                amount: Double(balance),
                silp_date: silpdate,
                silp_image: silpimage,
                request_by: payload.username,
                request_date: new Date(moment().format()),
                approve_by: null,
                approve_date: null,
                status: 'pending',
                description: notes.map(e => {
                    return {
                        username: e.username,
                        note: e.note,
                        note_date: e.note_date
                    }
                }),
                lock_status: "",
                lock_by: "",
                lock_date: null,
                cr_by: payload.user_id,
                cr_date: new Date(moment().format()),
                cr_prog: null,
                upd_by: null,
                upd_date: null,
                upd_prog: null

            })

            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.updatestatusmember = (payload, member_id) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection("member")
            .updateOne({
                _id: ObjectId(member_id)

            },
                {
                    $set: {
                        "status": "suspend",
                        "upd_by": ObjectId(payload.user_id),
                        "upd_date": new Date(moment().format()),
                        "upd_prog": "11007-withdraw-member"
                    }
                })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}