const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ObjectId } = require('mongodb');
//const collectionmember = "member"
//const collectionCONFIGURATION ="configuration"
//const collectionhistory_log_api ="history_log_api"
module.exports.getmyprofile = (payload) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('employee')
            .aggregate([
                {
                    $match : {
                        $and : [
                            //{ou_id : ObjectId(payload.ou)},
                          //{branch_id : ObjectId(payload.branch)},
                            {_id : ObjectId(payload.user_id)},
                        ]
                    }
                },
                {
                    $project:{
                        _id:1,
                            username:"$username",
                            agent_pool:"$pool",
                            name:"$name",
                            tel:"$tel",
                            status:"$status",
                            avatar:"$avatar",
                            role:"$role",
                            status_newmember:"$status_new_member",
                            create_date:"$cr_date",
                            update_date:"$upd_date",
                            update_by:"$upd_by"
                            
                    }
                },{$lookup:{
                    from:"emp_role",
                    localField:"role",
                    foreignField:"_id",
                    as:"role"
            }},  {
                    $unwind:{ path:"$role"}
                      }, {
                    $project:{
                        _id:1,
                            username:"$username",
                            agent_pool:"$agent_pool",
                            name:"$name",
                            tel:"$tel",
                            status:"$status",
                            avatar:"$avatar",
                            role:"$role.name",
                            status_newmember:"$status_newmember",
                            create_date:"$create_date",
                            update_date:"$update_date",
                            update_by:"$update_by"
                            
                    }
                },{$lookup:{
                    from:"agent",
                    localField:"agent_pool.agent_pool",
                    foreignField:"_id",
                    as:"agent"
            }},{
                    $project:{
                        _id:1,
                            username:"$username",
                            agent_pool:"$agent.name",
                            name:"$name",
                            tel:"$tel",
                            status:"$status",
                            avatar:"$avatar",
                            role:"$role",
                            status_newmember:"$status_newmember",
                            create_date:"$create_date",
                            update_date:"$update_date",
                            update_by:"$update_by"
                            
                    }
                },
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}
