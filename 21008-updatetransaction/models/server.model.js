const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const { ObjectId, Double } = require('mongodb');

module.exports.updateapprove = (body, payload, notes) => {
    let silpimage = null
    if (body.silp_image !== null && body.silp_image !== "") {
       silpimage = body.silp_image
    }
    let memb_id = null
    if (body.memb_id !== null && body.memb_id !== "") {
        memb_id = new ObjectId(body.memb_id)
    }
    let bank_id = null
    if (body.bank_id !== null && body.bank_id !== "") {
        bank_id = new ObjectId(body.bank_id)
    }
    let account_id = null
    if (body.bank_account_id !== null && body.bank_account_id !== "") {
         account_id = new ObjectId(body.bank_account_id)
    }
    let status = null
    if(body.type === "deposit"){
        status = "success"
    }else if (body.type === "withdraw"){
        if(body.from_bank_name === "bonus"){
            status = "success"
        }else{
            status = "approve"
        }
       
    }

    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(body.type)
            .updateOne({
                _id: ObjectId(body.doc_id)

            }, {
                $set: {
                    "memb_id":memb_id,
                    "from_bank_id":bank_id,
                    "from_account_id":account_id,
                    "silp_image": silpimage,
                    "status": status,
                    "description": notes,
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

        await MongoDB.collection('member')

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



module.exports.updatelock = (body, payload) => {
    console.log(payload);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(body.type)
            .updateOne({
                _id: ObjectId(body.doc_id)

            }, {
                $set: {
                    "lock_status": "",
                    "lock_by": ObjectId(payload.user_id),
                    "lock_date": new Date(moment().format()),
                }
            }, { upsert: true }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}

module.exports.updatechecked = (body, payload, notes) => {
    //console.log("body",body);
    let silpimage = null
    if (body.silp_image !== null && body.silp_image !== "") {
        silpimage = body.silp_image
    }
    let memb_id = null
    if (body.memb_id !== null && body.memb_id !== "") {
         memb_id = new ObjectId(body.memb_id)
    }
    let bank_id = null
    if (body.bank_id !== null && body.bank_id !== "") {
         bank_id = new ObjectId(body.bank_id)
    }
    let account_id = null
    if (body.bank_account_id !== null && body.bank_account_id !== "") {
         account_id = new ObjectId(body.bank_account_id)
    }

    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(body.type)
            .updateOne({
                _id: ObjectId(body.doc_id)
            }, {
                $set: {
                    "memb_id":memb_id,
                    "from_bank_id":bank_id,
                    "from_account_id":account_id,
                    "silp_image": silpimage,
                    "status": body.status,
                    "description": notes,
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

module.exports.updatereject = (body, payload, notes) => {
    //console.log(body);
    let silpimage = null
    if (body.silp_image !== null && body.silp_image !== "") {
       silpimage = body.silp_image
    }
    let memb_id = null
    if (body.memb_id !== null && body.memb_id !== "") {
        memb_id = new ObjectId(body.memb_id)
    }
    let bank_id = null
    if (body.bank_id !== null && body.bank_id !== "") {
         bank_id = new ObjectId(body.bank_id)
    }
    let account_id = null
    if (body.bank_account_id !== null && body.bank_account_id !== "") {
         account_id = new ObjectId(body.bank_account_id)
    }
   
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(body.type)
            .updateOne({
                _id: ObjectId(body.doc_id)

            }, {
                $set: {
                    "memb_id":memb_id,
                    "from_bank_id":bank_id,
                    "from_account_id":account_id,
                    "silp_image": silpimage,
                    "status": body.status,
                    "description": notes,
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

module.exports.updatemember = (memb_id, payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member')
            .updateOne({
                _id: ObjectId(memb_id)
            }, {
                $set: {
                    "status": "active",
                    "upd_by": ObjectId(payload.user_id),
                    "upd_date": new Date(moment().format()),
                    "upd_prog": "21008-updatetransaction"
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
        await MongoDB.collection('member')
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
        await MongoDB.collection('member')
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
        await MongoDB.collection('member')
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
        await MongoDB.collection('member')
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

