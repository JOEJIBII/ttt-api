const { MongoDB } = require("../build/mongodb");
const objectId = require('mongodb').ObjectId;
const moment = require('moment');
const { ObjectId, Double } = require('mongodb');
const { normalizeUnits } = require("moment");



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

module.exports.findjob = () => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('withdraw')
        .aggregate([
            {
                $match: {
                    $and: [
                        //{ou_id : ObjectId(payload.ou)},
                        //{branch_id : ObjectId(payload.branch)},
                        //{ agent_id: ObjectId(agent_id) },
                        { status: "pending" },
                        { from_bank_name: { $ne: "bonus" } }
        
                    ]
                }
            },
            {
                $lookup: {
                    from: 'member_provider_account',
                    localField: 'memb_id',
                    foreignField: 'memb_id',
                    as: 'db'
                }
            },
            {
                $unwind: { path: "$db" }
            },
            {
                $project:{
                    _id:1,
                    agent_id:"$agent_id",
                    withdraw:"$_id",
                    username:"$db.username",
                    memb_id:"$memb_id",
                    amount:"$amount"
                    
                    
                }
            }
        
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.finddeposit = (memb_id) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('deposit')
        .aggregate([
            {
                $match: {
                    $and: [
                        //{ou_id : ObjectId(payload.ou)},
                        //{branch_id : ObjectId(payload.branch)},
                        { memb_id: ObjectId(memb_id) },
                        { turnover_status: "open" },
                        { turnover_date: { $lt: new Date(moment().format()) }}
        
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    deposit_id:"$_id",
                    ref_id: "$ref_id",
                    turnover_value:"$turnover_value"
        
        
                }
            }
        
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.findturnoverprofile = (memb_id) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_turnover')
        .aggregate([
            {
                $match: {
                    $and: [
                        //{ou_id : ObjectId(payload.ou)},
                        //{branch_id : ObjectId(payload.branch)},
                        { memb_id: ObjectId(memb_id) },        
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    turnover:"$turnover"
        
        
                }
            }
        
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.update_docdeposit_turnover = (doc_id, turnover_use,status) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('deposit')
            .updateOne({
                _id: ObjectId(doc_id)
            }, {
                $set: {
                    "turnover_use":turnover_use ,
                    "turnover_status":status ,
                }
            }, { upsert: true }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}

module.exports.update_docdeposit_status = (doc_id, turnover_use) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('deposit')
            .updateOne({
                _id: ObjectId(doc_id)
            }, {
                $set: {
                    "turnover_use":turnover_use ,
                    "turnover_status":null ,
                    "turnover_date":null
                }
            }, { upsert: true }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}

module.exports.update_docwithdraw = (doc_id) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('withdraw')
            .updateOne({
                _id: ObjectId(doc_id)
            }, {
                $set: {
                    //"turnover_use":turnover_use ,
                    "status":"approve" ,
                    "upd_by":"auto-turnover",
                    "upd_date":new Date(moment().format()),
                    "upd_prog":"61003-turnover"
                }
            }, { upsert: true }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}

module.exports.update_docwithdrawstatus = (doc_id,status) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('withdraw')
            .updateOne({
                _id: ObjectId(doc_id)
            }, {
                $set: {
                    //"turnover_use":turnover_use ,
                    "status":status ,
                    "upd_by":"auto-turnover",
                    "upd_date":new Date(moment().format()),
                    "upd_prog":"61003-turnover"
                }
            }, { upsert: true }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}

module.exports.update_turnover = (memb_id,turnover) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_turnover')
            .updateOne({
                memb_id: ObjectId(memb_id)
            }, {
                $set: {
                    //"turnover_use":turnover_use ,
                    "turnover":Double(turnover) ,
                    // "upd_by":"auto-turnover",
                    // "upd_date":new Date(moment().format()),
                    // "upd_prog":"61003-turnover"
                }
            }, { upsert: true }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}


module.exports.updatestatusmember = (member_id) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection("member")
            .updateOne({
                _id: ObjectId(member_id)

            },
                {
                    $set: {
                        "status": "active",
                        "upd_date": new Date(moment().format()),
                        "upd_prog": "61003-turnover"
                    }
                })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}
