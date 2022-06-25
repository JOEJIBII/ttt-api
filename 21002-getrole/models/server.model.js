const { MongoDB } = require('../configs/connection_mongodb');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const collectionCONFIGURATION ="configuration"
const collectionhistory_log_api ="history_log_api"
module.exports.getrole = (body,payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
       
            await MongoDB.collection('emp_role')
            .aggregate([
                {
                    $project:{
                        _id:1,
                        name:"$name",
                        description:"$description",
                        level :"$level"
                    }
                }
                
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
        
    
        
            
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