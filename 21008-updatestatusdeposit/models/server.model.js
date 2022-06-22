const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const { ObjectId } = require('mongodb');
module.exports.updateapprove = (body,payload) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('deposit')
        .updateOne({_id: ObjectId(body.deposit_id)

        },{
            $set : {
                "status": body.status,
                "approve_by":ObjectId(payload.user_id),
                "approve_date":moment().format(),
                "upd_by": ObjectId(payload.user_id),
                "upd_date": moment().format(),
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
                     $match : {
                         $and : [
                             //{ou_id : ObjectId(payload.ou)},
                           //{branch_id : ObjectId(payload.branch)},
                             {
                                 _id : ObjectId(agent_id)
                             },
 
                         ]
                     }
                 }, 
                 {
                     $project:{
                             id:1,
                             prov_key: "$provider.prov_key",
                             prov_prefix: "$provider.prov_prefix",
                             prov_domain: "$provider.prov_domain",
                             prov_agentusername : "$provider.prov_agentusername",
                             prov_whitelabel : "$provider.prov_whitelabel",
                             
                     }
                 },
                
             ]).toArray()
             .then(result => resolve(result))
             .catch(error => reject(error));
     });
 }


 module.exports.getdocument = (deposit_id) => {
    // console.log(body);
     return new Promise(async (resolve, reject) => {
 
         await MongoDB.collection('deposit')
        
             .aggregate([
                 {
                     $match : {
                         $and : [
                             //{ou_id : ObjectId(payload.ou)},
                           //{branch_id : ObjectId(payload.branch)},
                             {
                                 _id : ObjectId(deposit_id)
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
                     $match : {
                         $and : [
                             //{ou_id : ObjectId(payload.ou)},
                           //{branch_id : ObjectId(payload.branch)},
                             {
                                 _id : ObjectId(memb_id)
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
                     $match : {
                         $and : [
                             //{ou_id : ObjectId(payload.ou)},
                           //{branch_id : ObjectId(payload.branch)},
                             {
                                 memb_id : ObjectId(memb_id)
                             },
 
                         ]
                     }
                 }, 
             ]).toArray()
             .then(result => resolve(result))
             .catch(error => reject(error));
     });
 }

 module.exports.updaterefid = (doc_id,ref_id,payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('deposit')
        .updateOne({_id: ObjectId(doc_id)

        },{
            $set : {
                "ref_id": ObjectId(ref_id),
                "upd_by": ObjectId(payload.user_id),
                "upd_date": moment().format(),
                "upd_prog": "21008-updatestatusdeposit"
            }
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}


module.exports.updatechecked = (body,payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('deposit')
        .updateOne({_id: ObjectId(body.deposit_id)

        },{
            $set : {
                "status": body.status,
                "check_by":ObjectId(payload.user_id),
                "check_date":moment().format(),
                "upd_by": ObjectId(payload.user_id),
                "upd_date": moment().format(),
                "upd_prog": "21008-updatestatusdeposit"
            }
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}

module.exports.updatereject = (body,payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('deposit')
        .updateOne({_id: ObjectId(body.deposit_id)

        },{
            $set : {
                "status": body.status,
                "approve_by":ObjectId(payload.user_id),
                "approve_date":moment().format(),
                "upd_by": ObjectId(payload.user_id),
                "upd_date": moment().format(),
                "upd_prog": "21008-updatestatusdeposit"
            }
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}


module.exports.upsertturnover = (memb_id,agent_id,amount,note) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_turnover')
        .updateOne({memb_id: ObjectId(memb_id),agent_id : ObjectId(agent_id)
        },{
            $set : {
                turnover : Number(amount),
                description : note,
                cr_by : "21008-updatestatusdeposit",
                cr_date : moment().format(),
                cr_prog : "21008-updatestatusdeposit",
                upd_by : "21008-updatestatusdeposit",
                upd_date : moment().format(),
                upd_prog : "21008-updatestatusdeposit"
            } 
        },{ upsert: true})
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}

module.exports.updateturnover = (memb_id,agent_id,amount,note) => {
    console.log(memb_id);console.log(agent_id);console.log(amount);console.log(note);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_turnover')
        .updateOne({memb_id: ObjectId(memb_id), agent_id : ObjectId(agent_id)},
        {
            $set : {
                //turnover : body.amount,
                //description : note,
                upd_by : "21008-updatestatusdeposit",
                upd_date : moment().format(),
                upd_prog : "21008-updatestatusdeposit"
            },
            $inc:{turnover:Number(amount)}
        },)
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}


module.exports.updatecredit = (agent_id,credit,payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent')
        .updateOne({_id: ObjectId(agent_id)

        },{
            $set : {
                "credit": credit,
                "upd_by": ObjectId(payload.user_id),
                "upd_date": moment().format(),
                "upd_prog": "21008-updatestatusdeposit"
            }
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}

module.exports.update_financial = (memb_id,amount,payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member_Test')
        .updateOne({_id: ObjectId(memb_id)

        },{
            $set : {
                "financial.deposit_first_time_amount": amount,
                "financial.deposit_first_time": moment().format(),
                "upd_by": ObjectId(payload.user_id),
                "upd_date": moment().format(),
                "upd_prog": "21008-updatestatusdeposit"
            }
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}