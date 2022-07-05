const { MongoDB } = require('../configs/connection_mongodb');
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const today = dayjs();
const moment = require('moment');
const collectionmember = "member"
const collectionCONFIGURATION ="configuration"
const collectionhistory_log_api ="history_log_api"
module.exports.getallmember = (body) => {
    console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember)
            .aggregate([
                {
                    $match : {
                        $and : [
                            //{ou_id : ObjectId(payload.ou)},
                          //{branch_id : ObjectId(payload.branch)},
                            { 
                                agent_id : ObjectId(body.agent_id)
                            }

                        ]
                    }
                },
                {
                    $project:{
                        _id:1,
                            username:"$username",
                            agent_id:"$agent_id",
                            line_id:"$line_id",
                            profile:{
                                name:"$name",
                                surename:"$surname",
                                birthday_date:"$birthday",
                                tel:"$tel",
                                privilege:"$member_profile.memb_privilege",
                                channel:"$channel",
                                partner:"$member_profile.memb_partner",
                                note:"$remark"
                               },
                            banking_account:"$banking_account",
                            financial:"$financial",
                            status:"$status",
                            status_newmember:"$status_new_member",
                            create_date:"$cr_date",
                            update_date:"$upd_date",
                            update_by:"$upd_by"
                            
                    }
                },
                {$lookup:{
                    from:"member_provider_account",
                    localField:"_id",
                    foreignField:"memb_id",
                    as:"provideracct"
            }}, 
            {
                $unwind:{ path:"$provideracct" }
                  },
                {
                $project:{
                    _id:1,
                        username:"$username",
                        agent_id:"$agent_id",
                        webname:"$name",
                        line_id:"$line_id",
                        username_provider:"$provideracct.username",
                        profile:"$profile",
                        banking_account:"$banking_account",
                        financial:"$financial",
                        status:"$status",
                        status_newmember:"$status_newmember",
                        create_date:"$create_date",
                        update_date:"$update_date",
                        update_by:"$update_by",
                }
            },{$lookup:{
                from:"agent",
                localField:"agent_id",
                foreignField:"_id",
                as:"Tbagent"
        }},{
            $unwind:{ path:"$Tbagent" }
              },
        {
            $project:{
                _id:1,
                prefix:"$Tbagent.name",
                    username:"$username",
                    prefix:"$Tbagent.name",
                    line_id:"$line_id",
                    username_provider:"$provideracct.username",
                    profile:"$profile",
                    banking_account:"$banking_account",
                    financial:"$financial",
                    status:"$status",
                    status_newmember:"$status_newmember",
                    create_date:"$create_date",
                    update_date:"$update_date",
                    update_by:"$update_by",
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