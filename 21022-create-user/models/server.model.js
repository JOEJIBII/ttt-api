const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const today = dayjs();
const collectionmember = "member"
const collectionCONFIGURATION = "agent"

module.exports.register = (body, ip, _user) => {
    let channel = null
    if(body.channel === null || body.channel === "")
    {
        channel = null
    }
    else{
        channel = ObjectId(body.channel)
    }
    let privilege = null
    if(body.privilege === null || body.privilege === "")
    {
        privilege = null
    }
    else{
        privilege = ObjectId(body.privilege)
    }
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember)
            .insertOne({
                agent_id: objectId(body.agent_id),
                username: _user,
                password: body.password,
                tel: body.tel,
                mobile_no: body.mobile_number,
                pin: body.pin,
                line_id: body.line_id,
                name: body.name,
                surname: body.surename,
                birthday_date: body.birthday,
                email: body.email,
                channel: channel,
                remark: body.remark,
                ipinfo: body.ipinfo,
                register_date: new Date(moment().format()),
                user_reference: body.user_reference,
                privilege: privilege,
                financial: {
                    deposit_first_time_amount: 0.00,
                    deposit_first_time: null,
                    deposit_count: 0,
                    deposit_total_amount: 0.00,
                    withdraw_first_time: 0,
                    withdraw_count: 0,
                    withdraw_total_amount: 0.00
                },
                status: body.status,
                status_new_member: 'N',
                cr_date: new Date(moment().format()),
                cr_by: "11000-create-user",
                cr_prog: "11000-create-user",
                upd_date: null,
                upd_by: null,
                upd_prog: null
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.findConF = (body) => {
    //console.log(JSON.stringify(body))
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionCONFIGURATION)
            .findOneAndUpdate(
                {
                    _id: ObjectId(body.agent_id)
                },
                {
                    $inc: {
                        "member.running_number": 1
                    }
                },

            )
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}



module.exports.createaccountprovider = (body, _id, CONF, _user) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member_provider_account')
            .insertOne({
                memb_id: _id,
                username: _user,
                password: CONF.value.prefix + "123456",
                prov_id: CONF.value.provider.prov_id,
                flagregister: "N",
                cr_by: "11000-create-user",
                cr_date: new Date(moment().format()),
                cr_prog: "11000-create-user",
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

// module.exports.createaccountprovider = (body, _id, CONF, _user) => {
//     return new Promise(async (resolve, reject) => {
//         await MongoDB.collection('member_provider_account')
//             .insertOne({
//                 memb_id: _id,
//                 username: _user,
//                 password: CONF.value.prefix + "123456",
//                 prov_id: CONF.value.provider.prov_id,
//                 flagregister: "N",
//                 cr_by: "11000-create-user",
//                 cr_date: new Date(moment().format()),
//                 cr_prog: "11000-create-user",
//             })
//             .then(result => resolve(result))
//             .catch(error => reject(error));
//     });
// }

module.exports.insertmembturnover = (memb_id, body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_turnover')
            .insertOne({
                memb_id: ObjectId(memb_id),
                agent_id: ObjectId(body.agent_id),
                turnover: parseFloat(0),
                description: null,
                status: "active",
                cr_by: "11000-create-user",
                cr_date: new Date(moment().format()),
                cr_prog: "11000-create-user",
                upd_by: null,
                upd_date: null,
                upd_prog: null,
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.insertbankmemb = (memb_id, body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_bank_account')
            .insertOne({
                memb_id: ObjectId(memb_id),
                agent_id: ObjectId(body.agent_id),
                bank_id: ObjectId(body.bank_id),
                account_number: body.bank_acct,
                account_name: body.name + " " + body.surename,
                description: null,
                status: "active",
                cr_by: "11000-create-user",
                cr_date: new Date(moment().format()),
                cr_prog: "11000-create-user",
                upd_by: null,
                upd_date: null,
                upd_prog: null
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.CheckBankAccount = (body) => {
    return new Promise(async (resolve, reject) => {
        console.log("test", body.agent_id, body.bank_acct, body.bank_id)

        await MongoDB.collection('memb_bank_account')

            .aggregate([
                {
                    $match: {
                        $and: [{
                            agent_id: ObjectId(body.agent_id)
                        }, { bank_id: ObjectId(body.bank_id) }, {
                            $or: [{
                                account_number: body.bank_acct
                            },
                            ]
                        }]
                    }
                },


            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.CheckTel = (body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember)
            .aggregate([{
                $match: {
                    '$and': [
                        { agent_id: ObjectId(body.agent_id) },
                        { tel: body.tel }
                    ]
                },
            }]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.get_acct_pd = (_id) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member_provider_account')
            .aggregate([{
                $match: {
                    '$and': [
                        { agent_id: ObjectId(_id) },
                    ]
                },
            }]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}
module.exports.removemember = (_id) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember).deleteOne({
            _id: ObjectId(_id)
        }
        )

            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.removemember_turnover = (_id) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_turnover').deleteOne({
            memb_id: ObjectId(_id)
        }
        )

            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.removebankmemb = (_id) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_turnover').deleteOne({
            memb_id: ObjectId(_id)
        }
        )

            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.removememberpd = (_id) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member_provider_account')
            .deleteOne({
                _id: ObjectId(_id)
            }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.getdetailmember = (user_id, body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember)

            .aggregate([
                {
                    $match: {
                        $and: [
                            {
                                _id: ObjectId(user_id)
                               
                            },
                            {
                                agent_id: ObjectId(body.agent_id)
                            }

                        ]
                    }
                },
                {
                    $project: {
                        username: "$username",
                        line_id: "$line_id",
                        agent_id: "$agent_id",
                        tel: "$tel",
                        profile: {
                            name: "$name",
                            surename: "$surname",
                            pin: "$pin",
                            register_ip: "$register_ip",
                            user_reference: "$user_reference",
                            email: "$email",
                            birthday_date: "$birthday_date",
                            mobile_number: "$mobile_no",
                            privilege: "$privilege",
                            channel: "$channel",
                            partner: "$partner",
                            note: "$remark"
                        },
                        banking_account: "$banking_account",
                        financial: "$financial",
                        status: "$status",
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
                        username: "$username",
                        line_id: "$line_id",
                        agent_id: "$agent_id",
                        tel: "$tel",
                        profile: {
                            name: "$profile.name",
                            surename: "$profile.surename",
                            pin: "$profile.pin",
                            register_ip: "$profile.register_ip",
                            user_reference: "$profile.user_reference",
                            email: "$profile.email",
                            birthday_date: "$profile.birthday_date",
                            mobile_number: "$profile.mobile_number",
                            privilege: "$profile.privilege",
                            channel: "$channel.channel",
                            channel_id: "$profile.channel",
                            partner: "$profile.partner",
                            note: "$profile.note"
                        },
                        banking_account: "$banking_account",
                        financial: "$financial",
                        status: "$status",
                        create_date: "$create_date",
                        update_date: "$update_date",
                        update_by: "$update_by"

                    }
                },
                  {
                     $unwind:{ path:"$profile.channel"}
                       },
                {
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
                        username: "$username",
                        line_id: "$line_id",
                        agent_id: "$agent_id",
                        tel: "$tel",
                        profile: "$profile",
                        bank_id: "$bank_memb.bank_id",
                        bank_account_name: "$bank_memb.account_name",
                        bank_account_number: "$bank_memb.account_number",
                        bank_account_status: "$bank_memb.status",
                        financial: "$financial",
                        status: "$status",
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
                        username: "$username",
                        line_id: "$line_id",
                        agent_id: "$agent_id",
                        tel: "$tel",
                        profile: "$profile",
                        banking_account: [{
                            bank_id: "$bank_id",
                            bank_acct: "$bank_account_number",
                            bank_acct_name: "$bank_account_name",
                            bank_name: "$bank.nameen",
                            bank_name_th: "$bank.nameth",
                            bank_code: "$bank.code",
                            bank_status: "$bank_account_status"
                        }],
                        financial: "$financial",
                        status: "$status",
                        create_date: "$create_date",
                        update_date: "$update_date",
                        update_by: "$update_by"

                    }
                }, {
                    $lookup: {
                        from: "agent",
                        localField: "agent_id",
                        foreignField: "_id",
                        as: "agent"
                    }
                },
                {
                    $unwind: { path: "$agent" }
                },
                {
                    $project: {
                        username: "$username",
                        line_id: "$line_id",
                        web_id: "$agent_id",
                        web_name: "$agent.name",
                        url: "$agent.domain_name",
                        tel: "$tel",
                        profile: "$profile",
                        banking_account: "$banking_account",
                        financial: "$financial",
                        status: "$status",
                        create_date: "$create_date",
                        update_date: "$update_date",
                        update_by: "$update_by"

                    }
                },




            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}