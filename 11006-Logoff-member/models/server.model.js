const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ObjectId } = require('mongodb');
const collectionmember = "member"
const collectionCONFIGURATION ="configuration"
const collectionhistory_log_api ="history_log_api"
module.exports.login = (body,host) => {
    //console.log(body);
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
                    time:new Date(moment().format()),
                    username : result[0].username,
                    user_id : ObjectId(result[0]._id),
                    agent_id:ObjectId(result[0].agent_id)
                    //exp:moment.fomat()
                }
                const gen_token = jwt.sign(data,jwtSecretKey,{expiresIn:'12H'})
                const R = {
                    token : gen_token,
                    profile_mem : result[0]
                }
                //console.log("token",R)
                resolve(R)})
            .catch(error => reject(error));
    });
}

module.exports.inserttoken = (body) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_session')
            .insertOne({
                memb_id: objectId(body.profile_mem._id),
                agent_id: objectId(body.profile_mem.agent_id),
                token: body.token,
                cr_date: moment().format(),
                cr_by: "11005-Login-member",
                cr_prog: "11005-Login-member",
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
        });  
}

module.exports.remove_session = async (_id) => {
    return new Promise(async (resolve, reject) => {
         await MongoDB.collection('memb_session').deleteMany({
            _id:ObjectId(_id)}
         )
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.find_session = (_id) => {
    return new Promise(async (resolve, reject) => {
    await MongoDB.collection('memb_session').aggregate([
            {
                $match : {
                    $and : [
                   
                        {memb_id : ObjectId(_id)}
                    
                    ]
                }
            },
            {
                $project :{
                _id:1
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