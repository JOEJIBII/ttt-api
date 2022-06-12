const { MongoDB } = require('../configs/connection_mongodb');
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const today = dayjs();
const moment = require('moment');
const collectionmember = "member-Test"
const collectionCONFIGURATION ="configuration"
const collectionhistory_log_api ="history_log_api"
module.exports.getallemp = (body) => {
   // console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('employee')
            .aggregate([
                {
                    $project:{
                        _id:1,
                        web:"$pool",
                        username:"$username",
                        password:"$password",
                        name:"$name",
                        tel:"$tel",
                        role:"$role",
                        avatar:"$avatar",
                        status:"$status",
                        crate_by:"$cr_by",
                        crate_date:"$cr_date",
                        update_by:"$upd_by",
                        update_date:"$upd_date",

                        
                    }
                },{$lookup:{
                    from:"agent",
                    localField:"web.agent_pool",
                    foreignField:"_id",
                    as:"webs"
            }}, {
                $unwind:{ path:"$webs" }
                  },
            {
                    $project:{
                        _id:1,
                        web:"$webs.name",
                        web_id:"$webs._id",
                        username:"$username",
                        password:"$password",
                        name:"$name",
                        tel:"$tel",
                        role:"$role",
                        avatar:"$avatar",
                        status:"$status",
                        crate_by:"$cr_by",
                        crate_date:"$cr_date",
                        update_by:"$upd_by",
                        update_date:"$upd_date",

                        
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

