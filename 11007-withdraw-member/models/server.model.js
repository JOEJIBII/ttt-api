const { MongoDB } = require('../configs/connection_mongodb');
// const objectId = require('mongodb').ObjectId;
const { ObjectId } = require('mongodb');
const moment = require('moment');
const { withdraw } = require('../controllers/server.controller');
const collectionmember = "member-Test"
const collectionCONFIGURATION ="configuration"
//const collectionhistory_log_api ="history_log_api"
module.exports.getwithdraw_config = (body,payload) => {
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
                                _id : ObjectId(payload.agent_id)
                            },

                        ]
                    }
                }, {
                    $unwind:{ path:"$withdraw_config" }
                 },
                {
                    $project:{
                            id:1,
                            counter:"$withdraw_config.counter",
                            min:"$withdraw_config.min_cash_limit",
                            max:"$withdraw_config.max_cash_limit",
                           // bank_account: "$agent_bank_account_withdraw",
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

module.exports.getbankweb = (body,payload) => {
    // console.log(body);
     return new Promise(async (resolve, reject) => {
 
         await MongoDB.collection('agent_bank_account')
        
         .aggregate([
            {
                $match : {
                    $and : [
                        //{ou_id : ObjectId(payload.ou)},
                      //{branch_id : ObjectId(payload.branch)},
                        {
                            agent_id : ObjectId("629e381cb4839cabb5622da1")
                        },
                        {
                            type : "withdraw"
                        },
                        {
                            status : "active"
                        }

                    ]
                }
            }, 
            {
                $project:{
                        id:1,
                      account_number : "$account_number",
                      account_name : "$account_name"
                        
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
                $match : {
                    $and : [
                        //{ou_id : ObjectId(payload.ou)},
                      //{branch_id : ObjectId(payload.branch)},
                        {memb_id:ObjectId(id)}
                    ]
                }
            }, {
                $project:{
                        id:1,
                       // name:"$name",
                       // surename:"$",
                       bank_id:"$bank_id",
                        account_name:"$account_name",
                        banking_account:"$account_number"
                        
                }
            },
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.Withrawcount = (_id,counter) => {
    console.log(_id)
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember)
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

module.exports.InsertDocWithdraw = (payload,balance,member,bankweb) => {
    console.log(payload)
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('withdraw')
            .insertOne({
                agent_id: ObjectId(payload.agent_id),
                type:"withdraw",
                date:moment().format(),
                memb_id: ObjectId(payload.user_id),
                from_bank_id: ObjectId(bankweb._id),
                from_account: bankweb.account_number,
                from_bank_name:bankweb.account_name,
                member_name:member.account_name,
                to_bank_id: ObjectId(member.bank_id),
                to_account: member.banking_account,
                amount: balance,
                silp_date: null,
                silp_image: null,
                request_by:payload.username,
                request_date: moment().format(),
                approve_by : null,
                approve_date:null,
                status : 'pending',
                description:null,
                cr_by:payload.username,
                cr_date:moment().format(),
                cr_prog: null,
                upd_by : null,
                upd_date: null,
                upd_prog:null

            })
                
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}