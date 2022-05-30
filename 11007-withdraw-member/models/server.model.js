const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const { ObjectId } = require('mongodb');
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
                            max:"$withdraw_config.max_cash_limit"
                            
                    }
                },
            //     {$lookup:{
            //         from:"member_provider_account",
            //         localField:"_id",
            //         foreignField:"memb_id",
            //         as:"memb"
            // }}
                
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

module.exports.Withrawcount = (_id) => {
    console.log(_id)
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember)
            .findOneAndUpdate(
                {
                    _id: ObjectId(_id)

                },
                {
                    $inc: {
                        "financial.withdraw_count": 1.0
                    }
                },

            )
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}