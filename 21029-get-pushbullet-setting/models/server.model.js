const { MongoDB } = require('../configs/connection_mongodb');
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const today = dayjs();
const moment = require('moment');
//const collectionmember = "member"
const collectionCONFIGURATION ="configuration"
const collectionhistory_log_api ="history_log_api"
module.exports.findpushbulletsetting = (body) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('msg_pushbullet_setting')
        .aggregate([
            {
                $match : {
                    $and : [
                        { 
                            agent_id : ObjectId(body.agent_id)
                        },  
                    ]
                }
            },
            {
                $project:{
                    _id:1,
                    agent_id : "$agent_id",
                    name : "$name",
                    identity : "$identity",
                    password : "$password",
                    token: "$token",
                    status : "$status",
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