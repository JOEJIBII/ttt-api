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



module.exports.updatetransaction = (ID, row_no, status,description) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('winloss_transaction')
            .updateOne({ _id: ObjectId(ID), "transaction_file.no": Number(row_no) },
                {
                    $set: {
                        "transaction_file.$.status": status,
                        "transaction_file.$.description": description,
                        "transaction_file.$.upd_date": new Date(moment().format()),
                        "transaction_file.$.upd_by": "21031-return-winloss"
                    }
                }, { upsert: true })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.updatefiletransaction = (ID,status) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('winloss_transaction')
            .updateOne({ _id: ObjectId(ID) },
                {
                    $set: {
                        status: status,
                        upd_by:"21031-return-winloss",
                        upd_date:new Date(moment().format()),
                        upd_prog:"21031-return-winloss"
                    }
                }, { upsert: true })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.findalltransaction = () => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('winloss_transaction')
        .aggregate([
            {
                $match : {
                    $and : [
                        { 
                            status : "pending"
                        },
                    ]
                }
            },
            {
                $project:{
                    _id:1,
                    agent_id:"$agent_id",
                    transaction_file:"$transaction_file",
                    cr_by:"$cr_by",
                    cr_date:"$cr_date"
                }
            },{
                $lookup: {
                    from: "employee",
                    localField: "cr_by",
                    foreignField: "_id",
                    as: "emp"
                }
            },{
                $unwind: { path: "$emp" }
            },{
                $project:{
                    _id:1,
                    agent_id:"$agent_id",
                    transaction_file:"$transaction_file",
                    cr_by:"$cr_by",
                    cr_by_name:"$emp.username",
                    cr_date:"$cr_date"
                }
            }
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.findmemberId = (username,agent_id) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member_provider_account')
        .aggregate([
            {
                $match : {
                    $and : [
                        { 
                            username : username
                        },
   
                    ]
                }
            },
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.InsertDocdeposit = (body,payload,bankform,bankto,agent_id,memb_id,notes,ref_id) => {
    // console.log(payload)
     return new Promise(async (resolve, reject) => {
         await MongoDB.collection('deposit')
             .insertOne({
                 agent_id: ObjectId(agent_id),
                 type:bankto.type,
                 sub_type:bankto.sub_type,
                 bank_transaction_id : null,
                 date:new Date(moment().format()),
                 memb_id: ObjectId(memb_id),
                 from_bank_id: ObjectId(bankform.bank_id),
                 from_account_id: ObjectId(bankform._id),
                 to_bank_id: ObjectId(bankto.bank_id),
                 to_account_id: ObjectId(bankto._id),
                 amount: body.amount,
                 silp_date: null,
                 silp_image: null,
                 request_by:ObjectId(payload),
                 request_date:new Date(moment().format()),
                 approve_by : ObjectId(payload),
                 approve_date:new Date(moment().format()),
                 status : "approve",
                 description:notes,
                 turnover_status:null,
                 turnover_date:null,
                 turnover_value:null,
                 ref_id:ObjectId(ref_id),
                 lock_status:"",
                 lock_by:"",
                 lock_date:null,
                 cr_by:  ObjectId(payload),
                 cr_date:new Date(moment().format()),
                 cr_prog: "61001-cron-returnwinloss",
                 upd_by :null,
                 upd_date:null,
                 upd_prog:null
 
             })
                 
             .then(result => resolve(result))
             .catch(error => reject(error));
     });
 }

module.exports.getbankagent = (agent_id) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent_bank_account')
        .aggregate([
            {
                $match: {
                    $and: [{
                        agent_id: ObjectId(agent_id),
                        sub_type: "bonus",
                        type:"deposit"
                    },]
                }
            },
            {
                $project:{
                    _id:1,
                    bank_id:"$bank_id",
                    type:"$type",
                    sub_type:"$sub_type"
                    
                }
            }
            
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}

module.exports.getbankmember = (memb_id,agent_id) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_bank_account')
        .aggregate([
            {
                $match: {
                    $and: [{
                        //agent_id: ObjectId(agent_id),
                        memb_id: ObjectId(memb_id)
                    },]
                }
            },
            {
                $project:{
                    _id:1,
                    bank_id:"$bank_id",
                    agent_id:"$agent_id"
                    
                }
            }
            
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}