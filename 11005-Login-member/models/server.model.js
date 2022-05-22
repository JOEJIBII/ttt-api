const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const today = dayjs();
const moment = require('moment');
const { ObjectId } = require('mongodb');
const collectionmember = "member-Test"
const collectionCONFIGURATION ="configuration"
const collectionhistory_log_api ="history_log_api"
module.exports.login = (body,host) => {
    console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember)
            .aggregate([
                {
                    $match : {
                        $and : [
                            //{ou_id : ObjectId(payload.ou)},
                          //{branch_id : ObjectId(payload.branch)},
                            {tel : body.tel},
                            {pin : body.pin}

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
               
            ]).toArray()
            .then(result => {
                //console.log("RE",result[0]._id)
                let jwtSecretKey = "bp888";
                
                let data = { 
                    time:Date(),
                    username : result[0].username,
                    user_id : ObjectId(result[0]._id),
                    agent_id:ObjectId(result[0].agent_id)
                    //exp:moment.fomat()
                }
                const token = jwt.sign(data,jwtSecretKey,{expiresIn:'12H'})
                //console.log("token",token)
                resolve(token)})
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