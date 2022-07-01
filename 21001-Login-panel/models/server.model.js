const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ObjectId } = require('mongodb');
//const collectionmember = "member-Test"
//const collectionCONFIGURATION ="configuration"
//const collectionhistory_log_api ="history_log_api"
module.exports.login = (body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('employee')
            .aggregate([
                {
                    $match : {
                        $and : [
                            //{ou_id : ObjectId(payload.ou)},
                          //{branch_id : ObjectId(payload.branch)},
                            {username : body.username},
                            {password : body.password}

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
                            agent_pool:"$pool",
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
                },
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.gen_token = (body) => {
    //console.log(body);


    let jwtSecretKey = "tea_true";
    
    let data = { 
        time:moment().format(),
        username : body.username,
        user_id : ObjectId(body._id),
        role : body.role,
        request:"panel"
        //agent_id:ObjectId(result[0].agent_id)
        //exp:moment.fomat()
    }
    const gen_token = jwt.sign(data, jwtSecretKey, { expiresIn: '48H' })
    const R = {
        token: gen_token,
    }
    return R
}

module.exports.inserttoken = (body,token) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('emp_session')
            .insertOne({
                employee_id: objectId(body._id),
                //agent_id: objectId(body.profile_mem.agent_id),
                token: "Bearer " +  token,
                skey:"tea_true",
                cr_date: new Date(moment().format()),
                cr_by: "21001-login-employee",
                cr_prog: "21001-login-employee",
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
        });  
}

module.exports.remove_session = async (_id) => {
    return new Promise(async (resolve, reject) => {
         await MongoDB.collection('emp_session').deleteMany({
            employee_id:ObjectId(_id)}
         )
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.find_session = (_id) => {
    return new Promise(async (resolve, reject) => {
    await MongoDB.collection('emp_session').aggregate([
            {
                $match : {
                    $and : [
                   
                        {employee_id : ObjectId(_id)}
                    
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