const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const { ObjectId } = require('mongodb');
const moment = require('moment');
const collectionbank = "bank"
const collectionCONFIGURATION ="configuration"
const collectionhistory_log_api ="history_log_api"
module.exports.getbanking = (body,payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        if(body.status === "Active"){
            await MongoDB.collection(collectionbank)
            .aggregate([
                {
                    $match : {
                        $and : [
                            //{ou_id : ObjectId(payload.ou)},
                          //{branch_id : ObjectId(payload.branch)},
                            { status : "active" }

                        ]
                    }
                },
                {
                    $project:{
                        _id:1,
                            banknameth:"$nameth",
                            banknameen:"$nameen",
                            bankcode:"$code",
                            status:"$status"
                    }
                }
                
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
        }
        else{
            await MongoDB.collection(collectionbank)
            .aggregate([
                // {
                //     $match : {
                //         $and : [
                //             //{ou_id : ObjectId(payload.ou)},
                //           //{branch_id : ObjectId(payload.branch)},
                //             { 
                //                 status : body.status
                //             }

                //         ]
                //     }
                // },
                {
                    $project:{
                        _id:1,
                            banknameth:"$nameth",
                            banknameen:"$nameen",
                            bankcode:"$code",
                            status:"$status"
                    }
                }
                
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));

        }
        
            
    });
}

module.exports.logs = (body,_id,ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
        .insertOne({
            memb_id:body.domain,
            api_name:"11004-getbanking",
            ip_address:ip,
            create_date:new Date(moment().format())
        })
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