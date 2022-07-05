const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ObjectId } = require('mongodb');
const collectionmember = "member"
const collectionCONFIGURATION = "configuration"
const collectionhistory_log_api = "history_log_api"
module.exports.login = (body, host) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember)
            .aggregate([
                {
                    $match: {
                        $and: [
                            //{ou_id : ObjectId(payload.ou)},
                            //{branch_id : ObjectId(payload.branch)},
                            { tel: body.tel },
                            { pin: body.pin }

                        ]
                    }
                },
                {
                    $project: {
                        _id: 1,
                        username: "$username",
                        agent_id: "$agent_id",
                        line_id: "$line_id",
                        profile: {
                            name: "$name",
                            surename: "$surname",
                            birthday_date: "$birthday_date",
                            tel: "$tel",
                            privilege: "$privilege",
                            channel: "$channel",
                            user_reference: "$user_reference",
                            note: "$remark"
                        },
                        financial: "$financial",
                        status: "$status",
                        status_newmember: "$status_new_member",
                        create_date: "$cr_date",
                        update_date: "$upd_date",
                        update_by: "$upd_by"

                    }
                }, {
                    $lookup: {
                        from: "agent",
                        localField: "agent_id",
                        foreignField: "_id",
                        as: "channel"
                    }
                }, {
                    $unwind: { path: "$channel" }
                }, {
                    $project: {
                        _id: 1,
                        username: "$username",
                        agent_id: "$agent_id",
                        line_id: "$line_id",
                        profile: {
                            name: "$profile.name",
                            surename: "$profile.surename",
                            birthday_date: "$profile.birthday_date",
                            tel: "$profile.tel",
                            channel: "$channel.channel",
                            channel_id: "$profile.channel",
                            privilege: "$profile.privilege",
                            user_reference: "$profile.user_reference",
                            note: "$profile.note"
                        },
                        financial: "$financial",
                        status: "$status",
                        status_newmember: "$status_newmember",
                        create_date: "$create_date",
                        update_date: "$update_date",
                        update_by: "$update_by"

                    }
                }, {
                    $unwind: { path: "$profile.channel" }
                },
                {
                    $unwind: { path: "$profile.channel" }
                }, {
                    $match: {
                        $expr: {
                            $eq: ["$profile.channel.channel_id", "$profile.channel_id"]
                        }
                    }
                },
                {
                    $lookup: {
                        from: "memb_bank_account",
                        localField: "_id",
                        foreignField: "memb_id",
                        as: "bank_memb"
                    }
                },
                {
                    $unwind: { path: "$bank_memb" }
                },
                {
                    $project: {
                        _id: 1,
                        username: "$username",
                        agent_id: "$agent_id",
                        line_id: "$line_id",
                        profile: "$profile",
                        bank_id: "$bank_memb.bank_id",
                        bank_account_name: "$bank_memb.account_name",
                        bank_account_number: "$bank_memb.account_number",
                        bank_account_status: "$bank_memb.status",
                        financial: "$financial",
                        status: "$status",
                        status_newmember: "$status_newmember",
                        create_date: "$create_date",
                        update_date: "$update_date",
                        update_by: "$update_by"

                    }
                },
                {
                    $lookup: {
                        from: "bank",
                        localField: "bank_id",
                        foreignField: "_id",
                        as: "bank"
                    }
                },
                {
                    $unwind: { path: "$bank" }
                },
                {
                    $project: {
                        _id: 1,
                        username: "$username",
                        agent_id: "$agent_id",
                        line_id: "$line_id",
                        profile: "$profile",
                        banking_account: [{
                            bank_id: "$bank_id",
                            bank_acct: "$bank_account_number",
                            bank_acct_name: "$bank_account_name",
                            bank_name: "$bank.nameen",
                            bank_name_th: "$bank.nameth",
                            bank_code: "$bank.code",
                            bank_status: "$bank_account_status",
                        }],
                        financial: "$financial",
                        status: "$status",
                        status_newmember: "$status_newmember",
                        create_date: "$create_date",
                        update_date: "$update_date",
                        update_by: "$update_by"

                    }
                },

            ]).toArray()
            .then(result => {
                // console.log("RE",result)

                // let jwtSecretKey = "tea_true";

                // let data = { 
                //     time:moment().format(),
                //     username : result[0].username,
                //     user_id : ObjectId(result[0]._id),
                //     agent_id:ObjectId(result[0].agent_id),
                //     request:"member"
                //     //exp:moment.fomat()
                // }
                // const gen_token = jwt.sign(data,jwtSecretKey,{expiresIn:'12H'})
                // const R = {
                //     token : gen_token,
                //     profile_mem : result[0]
                // }
                //console.log("token",R)
                resolve(result)
            })
            .catch(error => reject(error));
    });
}

module.exports.gen_token = (body) => {
    //console.log(body);


    let jwtSecretKey = "tea_true";

    let data = {
        time: new Date(moment().format()),
        username: body.username,
        user_id: ObjectId(body._id),
        agent_id: ObjectId(body.agent_id),
        request: "member"
        //exp:moment.fomat()
    }
    const gen_token = jwt.sign(data, jwtSecretKey, { expiresIn: '12H' })
    const R = {
        token: gen_token,
    }
    return R
}

module.exports.inserttoken = (body,token) => {
    console.log("inserttoken",token.token);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_session')
            .insertOne({
                memb_id: objectId(body[0]._id),
                agent_id: objectId(body[0].agent_id),
                token: "Bearer " + token.token,
                skey: "tea_true",
                cr_date: new Date(moment().format()),
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
            _id: ObjectId(_id)
        }
        )
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.find_session = (_id) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_session').aggregate([
            {
                $match: {
                    $and: [

                        { memb_id: ObjectId(_id) }

                    ]
                }
            },
            {
                $project: {
                    _id: 1
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
                    $match: {
                        $and: [
                            //{ou_id : ObjectId(payload.ou)},
                            //{branch_id : ObjectId(payload.branch)},
                            { domain_name: body.domain_name }
                        ]
                    }
                },

            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}