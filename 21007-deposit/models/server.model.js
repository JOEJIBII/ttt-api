const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const moment = require('moment');
const { ObjectId } = require('mongodb');
module.exports.getbankfrom = (body,agentid) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_bank_account')
        .aggregate([
            {
                $match: {
                    $and: [{
                        agent_id: ObjectId(agentid.agent_id),
                        memb_id: ObjectId(body.memb_id)
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


module.exports.getbanktobyaccount_id = (body,agentid) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent_bank_account')
        .aggregate([
            {
                $match: {
                    $and: [{
                        agent_id: ObjectId(agentid.agent_id),
                        _id: ObjectId(body.account_deposit)
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

module.exports.getbanktobystatus = (agentid) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent_bank_account')
        .aggregate([
            {
                $match: {
                    $and: [{
                        agent_id: ObjectId(agentid.agent_id),
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

module.exports.getagentid = (body) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member')
        .aggregate([
            {
                $match: {
                    $and: [{
                      
                        _id: ObjectId(body.memb_id)
                    },]
                }
            },
            {
                $project:{
                    _id:1,
                    agent_id:"$agent_id",
                    financial:"$financial"
                    
                }
            }
            
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}

module.exports.InsertDocdeposit = (body,payload,bankform,bankto,agentid,notes,turnover) => {
   // console.log(payload)
   let silpimage = null
   let silpdate = null
   if(silpimage !== null && silpimage !== ""){
    silpimage = body.silp_image
   }
   if(body.transaction_date !== null && body.transaction_date !== ""){
    silpdate = new Date(moment(body.transaction_date).format())
   }
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('deposit')
            .insertOne({
                agent_id: ObjectId(agentid.agent_id),
                channel:"panel",
                type:bankto.type,
                sub_type:bankto.sub_type,
                bank_transaction_id : null,
                date:new Date(moment().format()),
                memb_id: ObjectId(body.memb_id),
                from_bank_id: ObjectId(bankform.bank_id),
                from_account_id: ObjectId(bankform._id),
                to_bank_id: ObjectId(bankto.bank_id),
                to_account_id: ObjectId(bankto._id),
                amount: body.amount,
                silp_date: silpdate,
                silp_image: silpimage,
                request_by:payload.username,
                request_date: new Date(moment().format()),
                approve_by : null,
                approve_date:null,
                status : 'pending',
                //description:body.description,
                description: notes,
                turnover_status:null,
                turnover_date:null,
                turnover_value:turnover,
                turnover_use:null,
                ref_id:null,
                lock_status:"",
                lock_by:"",
                lock_date:null,
                cr_by:payload.username,
                cr_date:new Date(moment().format()),
                cr_prog: null,
                upd_by : null,
                upd_date: null,
                upd_prog:null

            })
                
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.getconfig_turnover = (agent_id) => {
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
                        turnover_config:"$turnover_config"
                    }
                },
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.updatelastdeposit = (deposit_id) => {
    const date = new Date()
    const future = 5 * 60 * 1000
    date.setTime(date.getTime() + future)
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection("deposit")
            .updateOne({
                _id: ObjectId(deposit_id)

            },
                {
                    $set: {
                        "turnover_date": new Date(moment(date).format()),
                        "turnover_status": "open",
                       // "upd_by": ObjectId(payload.user_id),
                      //  "upd_date": new Date(moment().format()),
                      //  "upd_prog": "11007-withdraw-member"
                    }
                },{upsert:true})
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
                        _id:1,
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