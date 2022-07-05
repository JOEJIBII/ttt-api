const { MongoDB } = require('../configs/connection_mongodb');
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const today = dayjs();
const moment = require('moment');
//const collectionmember = "member"
const collectionCONFIGURATION ="configuration"
const collectionhistory_log_api ="history_log_api"
module.exports.getautotranfer = (body,bank_id) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent_bank_account')
        .aggregate([
            {
                $match : {
                    $and : [
                        { 
                            agent_id : ObjectId(body.agent_id)
                        },  
                        {
                            status:{$not:{$eq:"delete"}}
                        },
                        {
                            status:"active"
                        },
                        {
                            sms_auto_status:"inactive"
                        },
                        {
                            sub_type:{$not:{$eq:"bonus"}}
                        },
                        {
                            sub_type:body.type
                        },
                        {
                            bank_id:ObjectId(bank_id)
                        },
                      
                    ]
                }
            },
            {
                $project:{
                    _id:1,
                    bank_id : "$bank_id",
                    bank_account : "$account_number",
                    account_name : "$account_name",
                    description:"$description",
                    status:"$status",
                    type : "$type",
                    sub_type : "$sub_type",
                    memb_bank:"$memb_bank",
                    bank_auto_status:"$bank_auto_status",
                    bank_auto_config:"$bank_auto_config",
                    sms_auto_status:"$sms_auto_status",
                    sms_auto_config:"$sms_auto_config",
                    privilege:"$privilege"
                }
            },{$lookup:{
                        from:"bank",
                        localField:"bank_id",
                        foreignField:"_id",
                        as:"banks"
                }},
                {
                    $unwind:{ path:"$banks"}
                      },
                      {
                        $project:{
                            _id:1,
                            bank_id : "$bank_id",
                            bank_account : "$bank_account",
                            account_name : "$account_name",
                            bank_name_th : "$banks.nameth",
                            bank_name_en : "$banks.nameen",
                            bank_code : "$banks.code",
                            description:"$description",
                            bank_status:"$status",
                            type : "$type",
                            sub_type : "$sub_type",
                            memb_bank:"$memb_bank",
                            bank_auto_status:"$bank_auto_status",
                            bank_auto_config:"$bank_auto_config",
                            sms_auto_status:"$sms_auto_status",
                            sms_auto_config:"$sms_auto_config",
                            privilege:"$privilege"
                        }
                    },
                    {$lookup:{
                        from:"bank",
                        localField:"memb_bank",
                        foreignField:"_id",
                        as:"banks"
                }},  {
                    $unwind: { path: "$banks", preserveNullAndEmptyArrays: true }
            },
                {
                    $project:{
                        _id:1,
                        bank_id : "$bank_id",
                        bank_account : "$bank_account",
                        account_name : "$account_name",
                        bank_name_th : "$bank_name_th",
                        bank_name_en : "$bank_name_en",
                        bank_code : "$bank_code",
                        description:"$description",
                        bank_status:"$bank_status",
                        type : "$type",
                        sub_type : "$sub_type",
                        memb_bank: {
                            $cond: [{
                                    $eq: [{ $ifNull: ["$banks.code", null] }, null]
                            },
                                    null,
                            {
                                memb_bank_id:"$memb_bank",
                                memb_bank_nameth:"$banks.nameth",
                                memb_bank_nameen:"$banks.nameen",
                                memb_bank_code:"$banks.code",
                            }]
                    },
                        bank_auto_status:"$bank_auto_status",
                        bank_auto_config:"$bank_auto_config",
                        sms_auto_status:"$sms_auto_status",
                        sms_auto_config:"$sms_auto_config",
                        privilege:"$privilege"
                    }
                },
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.getbankid = (body) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('bank')
        .aggregate([
            {
                $match : {
                    $and : [
                        {
                            code:body.bank_code
                        },
                      
                    ]
                }
            },
            {
                $project:{
                    _id:1,
                }
            }
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