const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const { ObjectId, Double } = require('mongodb');

module.exports.updateapprove = (body, payload) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(body.type)
            .updateOne({
                _id: ObjectId(body.doc_id)

            }, {
                $set: {
                    "status": body.status,
                    "approve_by": ObjectId(payload.user_id),
                    "approve_date": new Date(moment().format()),
                    "upd_by": ObjectId(payload.user_id),
                    "upd_date": new Date(moment().format()),
                    "upd_prog": "21008-updatestatusdeposit"
                }
            })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
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


module.exports.getdocument = (body) => {
    // console.log(body);
    return new Promise(async (resolve, reject) => {

        await MongoDB.collection(body.type)

            .aggregate([
                {
                    $match: {
                        $and: [
                            {
                                _id: ObjectId(body.doc_id)
                            },

                        ]
                    }
                },
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.getmemb = (memb_id) => {
    // console.log(body);
    return new Promise(async (resolve, reject) => {

        await MongoDB.collection('member-Test')

            .aggregate([
                {
                    $match: {
                        $and: [
                            //{ou_id : ObjectId(payload.ou)},
                            //{branch_id : ObjectId(payload.branch)},
                            {
                                _id: ObjectId(memb_id)
                            },

                        ]
                    }
                },
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.getmembpd = (memb_id) => {
    // console.log(body);
    return new Promise(async (resolve, reject) => {

        await MongoDB.collection('member_provider_account')

            .aggregate([
                {
                    $match: {
                        $and: [
                            //{ou_id : ObjectId(payload.ou)},
                            //{branch_id : ObjectId(payload.branch)},
                            {
                                memb_id: ObjectId(memb_id)
                            },

                        ]
                    }
                },
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.updaterefid = (doc_id, ref_id, payload, type) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(type)
            .updateOne({
                _id: ObjectId(doc_id)

            }, {
                $set: {
                    "ref_id": ObjectId(ref_id),
                    "upd_by": ObjectId(payload.user_id),
                    "upd_date": new Date(moment().format()),
                    "upd_prog": "21008-updatestatusdeposit"
                }
            }, { upsert: true }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}


module.exports.updatechecked = (body, payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(body.type)
            .updateOne({
                _id: ObjectId(body.doc_id)

            }, {
                $set: {
                    "status": body.status,
                    "check_by": ObjectId(payload.user_id),
                    "check_date": new Date(moment().format()),
                    "upd_by": ObjectId(payload.user_id),
                    "upd_date": new Date(moment().format()),
                    "upd_prog": "21008-updatestatusdeposit"
                }
            })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}

module.exports.updatereject = (body, payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(body.type)
            .updateOne({
                _id: ObjectId(body.doc_id)

            }, {
                $set: {
                    "status": body.status,
                    "approve_by": ObjectId(payload.user_id),
                    "approve_date": new Date(moment().format()),
                    "upd_by": ObjectId(payload.user_id),
                    "upd_date": new Date(moment().format()),
                    "upd_prog": "21008-updatestatusdeposit"
                }
            })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}


module.exports.upsertturnover = (memb_id, agent_id, amount, note) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_turnover')
            .updateOne({
                memb_id: ObjectId(memb_id), agent_id: ObjectId(agent_id)
            }, {
                $set: {
                    turnover: Number(amount),
                    description: note,
                    cr_by: "21008-updatestatusdeposit",
                    cr_date: new Date(moment().format()),
                    cr_prog: "21008-updatestatusdeposit",
                    upd_by: "21008-updatestatusdeposit",
                    upd_date: new Date(moment().format()),
                    upd_prog: "21008-updatestatusdeposit"
                }
            }, { upsert: true })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}

module.exports.updateturnover = (memb_id, agent_id, amount, note) => {
    //console.log(memb_id);console.log(agent_id);console.log(amount);console.log(note);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_turnover')
            .updateOne({ memb_id: ObjectId(memb_id), agent_id: ObjectId(agent_id) },
                {
                    $set: {
                        //turnover : body.amount,
                        //description : note,
                        upd_by: "21008-updatestatusdeposit",
                        upd_date: new Date(moment().format()),
                        upd_prog: "21008-updatestatusdeposit"
                    },
                    $inc: { turnover: Number(amount) }
                })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}


module.exports.updatecredit = (agent_id, credit, payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent')
            .updateOne({
                _id: ObjectId(agent_id)

            }, {
                $set: {
                    "credit": credit,
                    "upd_by": ObjectId(payload.user_id),
                    "upd_date": new Date(moment().format()),
                    "upd_prog": "21008-updatestatusdeposit"
                }
            })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}

module.exports.update_financial = (memb_id, amount, payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member-Test')
            .updateOne({
                _id: ObjectId(memb_id)

            }, {
                $set: {
                    "upd_by": ObjectId(payload.user_id),
                    "upd_date": new Date(moment().format()),
                    "upd_prog": "21008-updatestatusdeposit"
                },
                $inc: { "financial.deposit_count": Number(1), "financial.deposit_total_amount": Number(amount) }
            }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}


module.exports.update_financial_withdraw = (memb_id, amount, payload) => {
    console.log("update", amount);
    console.log("memb_id", memb_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member-Test')
            .updateOne({
                _id: ObjectId(memb_id)
            }, {
                $set: {
                    "financial.withdraw_first_time_amount": Double(amount),
                    "financial.withdraw_first_time": new Date(moment().format()),
                    "upd_by": ObjectId(payload.user_id),
                    "upd_date": new Date(moment().format()),
                    "upd_prog": "21008-updatetrasaction"
                },
                $inc: { "financial.withdraw_count": 1, "financial.withdraw_total_amount": Double(amount) }
            },
                { upsert: true }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}


module.exports.update_financial_first = (memb_id, amount, payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member-Test')
            .updateOne({
                _id: ObjectId(memb_id)

            }, {
                $set: {
                    "financial.deposit_first_time_amount": amount,
                    "financial.deposit_first_time": new Date(moment().format()),
                    "upd_by": ObjectId(payload.user_id),
                    "upd_date": new Date(moment().format()),
                    "upd_prog": "21008-updatestatusdeposit"
                },
                $inc: { "financial.deposit_count": Number(1), "financial.deposit_total_amount": Number(amount) }
            }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}


module.exports.update_financial_withdraw_first = (memb_id, amount, payload) => {
    console.log("update", amount);
    console.log("memb_id", memb_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member-Test')
            .updateOne({
                _id: ObjectId(memb_id)
            }, {
                $set: {
                    "upd_by": ObjectId(payload.user_id),
                    "upd_date": new Date(moment().format()),
                    "upd_prog": "21008-updatetrasaction"
                },
                $inc: { "financial.withdraw_count": 1, "financial.withdraw_total_amount": Double(amount) }
            },
                { upsert: true }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}

//======================================== Enddeposit =================================================\\

