const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const { ObjectId } = require('mongodb');
const collectionmember = "member-Test"
const collectionCONFIGURATION ="configuration"
//const collectionhistory_log_api ="history_log_api"
module.exports.getdetailmember = (user_id,agent_id) => {
   // console.log(body);
    return new Promise(async (resolve, reject) => {
//console.log(CONF[0]._id);
//console.log(payload.user_id);
        await MongoDB.collection(collectionmember)
       
        .aggregate([
            {
                $match : {
                    $and : [
                        //{ou_id : ObjectId(payload.ou)},
                      //{branch_id : ObjectId(payload.branch)},
                        { _id : ObjectId(user_id),
                          agent_id : ObjectId(agent_id)
                        }

                    ]
                }
            },
            {
                $project:{
                        username:"$username",
                        line_id:"$line_id",
                        tel:"$tel",
                        profile:{
                            name:"$name",
                            surename:"$surname",
                            birthday_date:"$birthday",
                            mobile_number:"$tel",
                            privilege:"$privilege",
                            channel:"$channel",
                            partner:"$partner",
                            note:"$remark"
                           },
                        banking_account:"$banking_account",
                        financial:"$financial",
                        status:"$status",
                         create_date:"$cr_date",
                         update_date:"$upd_date",
                         update_by:"$upd_by"
                        
                }
            },
            {$lookup:{
                from:"memb_bank_account",
                localField:"_id",
                foreignField:"memb_id",
                as:"bank_memb"
        }}, 
        {
                $unwind:{ path:"$bank_memb"}
                  },
                  {
                $project:{
                        username:"$username",
                        line_id:"$line_id",
                        tel:"$tel",
                        profile:{
                            name:"$name",
                            surename:"$surname",
                            birthday_date:"$birthday",
                            mobile_number:"mobile_number",
                            privilege:"$privilege",
                            channel:"$channel",
                            partner:"$partner",
                            note:"$note"
                          },
                        bank_id: "$bank_memb.bank_id",
                        bank_account_name: "$bank_memb.account_name",
                        bank_account_number: "$bank_memb.account_number",
                        bank_account_status: "$bank_memb.status",
                        financial:"$financial",
                        status:"$status",
                         create_date:"create_date",
                         update_date:"update_date",
                         update_by:"update_by"
                        
                }
            },
                  {$lookup:{
                from:"bank",
                localField:"bank_id",
                foreignField:"_id",
                as:"bank"
        }}, 
        {
                $unwind:{ path:"$bank"}
                  },
        {
                $project:{
                        username:"$username",
                        line_id:"$line_id",
                        tel:"$tel",
                        profile:{
                            name:"$name",
                            surename:"$surname",
                            birthday_date:"$birthday",
                            mobile_number:"mobile_number",
                            privilege:"$privilege",
                            channel:"$channel",
                            partner:"$partner",
                            note:"note"
                          },
                        banking_account:[{
                            bank_id : "$bank_id",
                            bank_acct : "$bank_account_number",
                            bank_acct_name : "$bank_account_name",
                            bank_name : "$bank.nameen",
                            bank_name_th : "$bank.nameth",
                            bank_code : "$bank.code",
                            bank_status : "$bank_account_status"
                        }],
                        financial:"$financial",
                        status:"$status",
                         create_date:"create_date",
                         update_date:"update_date",
                         update_by:"update_by"
                        
                }
            },
            
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}



module.exports.findConF = (body) => {
    return new Promise(async (resolve, reject) => {
          await MongoDB.collection(collectionCONFIGURATION)
          .aggregate([
            {
                $match : {
                    $and : [
                        //{ou_id : ObjectId(payload.ou)},
                      //{branch_id : ObjectId(payload.branch)},
                        {domain_name : body.domain_name}
                    ]
                }
            },
            
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}