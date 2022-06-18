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
                            }

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
                            bank_account: "$agent_bank_account_withdraw",
                            prov_key: "$provider.prov_key",
                            prov_prefix: "$provider.prov_prefix",
                            prov_domain: "$provider.prov_domain",
                            prov_agentusername : "$provider.prov_agentusername",
                            prov_whitelabel : "$provider.prov_whitelabel",
                            
                    }
                },
                // {
                //     $unwind:{ path:"$config_pd" }
                //  },{
                //     $project:{
                //             id:1,
                //             counter:"$counter",
                //             min:"$min",
                //             max:"$max",
                //             bank_account: "$bank_account",
                //             prov_key: "$config_pd.prov_key",
                //             prov_prefix: "$config_pd.prov_prefix",
                //             prov_domain: "$config_pd.prov_domain",
                //             prov_agentusername : "$config_pd.prov_agentusername",
                //             prov_whitelabel : "$config_pd.prov_whitelabel"
                //     }
                // },
           
                
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

module.exports.InsertDocWithdraw = (payload,balance,bankwithdraw,member) => {
    console.log(payload)
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('withdraw')
            .insertOne({
                agent_id: ObjectId(payload.agent_id),
                type:null,
                date:moment().format(),
                memb_id: ObjectId(payload.user_id),
                from_bank_id: ObjectId(bankwithdraw.bank_id),
                from_account_id: bankwithdraw.bank_account,
                member_name:member.account_name,
                to_bank_id: ObjectId(member._id),
                to_account: member.account_number,
                amount: balance,
                silp_date: null,
                silp_image: null,
                request_by:payload.username,
                request_date: moment().format(),
                approve_by : null,
                approve_date:null,
                status : 'pending',
                description:null,
                cr_by:null,
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