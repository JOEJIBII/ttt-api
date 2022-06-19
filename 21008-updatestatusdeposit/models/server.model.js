const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const { ObjectId } = require('mongodb');
module.exports.updatestatus = (body,payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('deposit')
        .updateOne({_id: ObjectId(body.deposit_id)

        },{
            $set : {
                "status": body.status,
                "upd_by": payload.username,
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
                "upd_by": payload.username,
                "upd_date": moment().format(),
                "upd_prog": "21008-updatestatusdeposit"
            }
        })
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
                "upd_by": payload.username,
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
                "upd_by": payload.username,
                "upd_date": moment().format(),
                "upd_prog": "21008-updatestatusdeposit"
            }
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}