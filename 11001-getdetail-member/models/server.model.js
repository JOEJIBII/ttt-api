const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');
const today = dayjs();
const collectionmember = "member-Test"
const collectionCONFIGURATION ="configuration"
const collectionhistory_log_api ="history_log_api"
module.exports.getdetailmember = (body) => {
    console.log(body);
    return new Promise(async (resolve, reject) => {
//console.log(CONF[0]._id);
        await MongoDB.collection(collectionmember)
            .aggregate([
                {
                    $match : {
                        $and : [
                            //{ou_id : ObjectId(payload.ou)},
                          //{branch_id : ObjectId(payload.branch)},
                            { username : body.username,
                                agent_id : objectId(body.agent_id)
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