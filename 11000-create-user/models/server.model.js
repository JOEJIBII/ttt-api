const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const today = dayjs();
const collectionmember = "member-Test"
const collectionCONFIGURATION = "agent"
module.exports.register = (body,ip) => {
    return new Promise(async (resolve, reject) => {

        //console.log(CONF);
        await MongoDB.collection(collectionmember)
            .insertOne({
                agent_id: objectId(body.agent_id),
                username: body.username,
                password: body.password,
                tel: body.tel,
                pin: body.pin,
                line_id: body.line_id,
                name: body.name,
                surname: body.surename,
                birthday_date: body.birthday,
                tag: body.tag.map(e => {
                    return objectId(e)
                }),
                channel: body.channel.map(e => objectId(e)),
                remark: body.remark,
                register_ip: ip,
                register_date: today.format("DD/MM/YYYY HH:mm:ss"),
                user_reference: body.user_reference,
                promotion_status: body.promotion_status,
                banking_account: body.banking_account.map(e => {
                    return {
                        bank_id: objectId(e.bank_id),
                        bank_acct: e.bank_acct,
                        bank_name: e.bank_name,
                        bank_code: e.bankcode,
                        bank_status: e.bank_status
                    }
                }),
                financial: {
                    deposit_first_time_amount: 0.00,
                    deposit_first_time: null,
                    deposit_count: 0,
                    deposit_total_amount: 0.00,
                    withdraw_first_time: 0,
                    withdraw_count: 0,
                    withdraw_total_amount: 0.00
                },
                status: 'active',
                status_new_member: 'N',
                cr_date: today.format("DD/MM/YYYY HH:mm:ss"),
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

// module.exports.CheckMobileandacct = (body) => {
//     return new Promise(async (resolve, reject) => {
//         await MongoDB.collection(collectionmember)

//             .aggregate([
//                 {
//                     $match: {
//                         $and: [{
//                             agent_id: ObjectId(body.agent_id)
//                         }, {
//                             $or: [{
//                                 username: body.username
//                             }, {
//                                 tel: body.tel
//                             }, {
//                                 $and: [{
//                                     "banking_account.bank_id": ObjectID(body.banking_account.bank_id)
//                                 }, {
//                                     "banking_account.bank_acct": body.banking_account.bank_acct
//                                 }]
//                             }]
//                         }]
//                     }
//                 },
//                 {
//                     $unwind: { path: "$banking_account", preserveNullAndEmptyArrays: true }
//                 },
//                 {
//                     $project: {
//                         duplicate_username: { $cond: [{ $eq: ["$username", body.username] }, 1, 0] },
//                         duplicate_tel: { $cond: [{ $eq: ["$tel", body.tel] }, 1, 0] },
//                         duplicate_x: { $cond: [{ $eq: ["$banking_account.bank_id", ObjectID(body.banking_account.bank_id)] }, 1, 0] },
//                         duplicate_bank: {
//                             $cond: [{
//                                 $eq: ["$banking_account.bank_acct", body.banking_account.map(e => {
//                                     return {
//                                         bank_acct: e.bank_acct
//                                     }
//                                 })
//                                 ]
//                             }, 1, 0]
//                         },


//                     }
//                 },
//                 {
//                     $group: {
//                         _id: 1,
//                         duplicate_username: { $sum: "$duplicate_username" },
//                         duplicate_tel: { $sum: "$duplicate_tel" },
//                         duplicate_bank: { $sum: "$duplicate_bank" }
//                     }
//                 },
//                 {
//                     $project: {
//                         duplicate_username: { $cond: [{ $gt: ["$duplicate_username", 0] }, true, false] },
//                         duplicate_tel: { $cond: [{ $gt: ["$duplicate_tel", 0] }, true, false] },
//                         duplicate_bank: { $cond: [{ $gt: ["$duplicate_bank", 0] }, true, false] },
//                     }
//                 }

//             ]).toArray()
//             .then(result => resolve(result))
//             .catch(error => reject(error));
//     });
// }

module.exports.findConF = (body) => {
    console.log(JSON.stringify(body))
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionCONFIGURATION)
            .findOneAndUpdate(
                {
                    domain_name: body.domain_name

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



module.exports.createaccountprovider = (body, _id, CONF) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member_provider_account')
            .insertOne({
                memb_id: _id,
                username: CONF.value.provider.prov_agentusername + CONF.value.prefix + CONF.value.member.running_number,
                password: "",
                prov_id: CONF.value.provider.prov_id,
                flagregister: "N",
                cr_by :  "11000-create-user",
                cr_date :moment().format(), 
                cr_prog :  "11000-create-user",
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.CheckBankAccount = (body) => {
    return new Promise(async (resolve, reject) => {
        let query = {
            $and: [{
                agent_id: objectId(body.agent_id)
            }, { $or: [] }]
        }
        for (const i of body.banking_account) {
            query.$and[1].$or.push({
                $and: [{ "banking_account.bank_id": objectId(i.bank_id) }, { "banking_account.bank_acct": i.bank_acct }]
            })
        }
        await MongoDB.collection(collectionmember)

            .aggregate([
                {
                    $match: query
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
                $match : {
                    '$and': [
                     { agent_id: ObjectId(body.agent_id) },
                     {tel:body.tel}
                 ]},
                }]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.get_acct_pd = (_id) => {
    return new Promise(async (resolve, reject) => {
         await MongoDB.collection('member_provider_account')
            .aggregate([{
                $match : {
                    '$and': [
                     { agent_id: ObjectId(_id) },
                 ]},
                }]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}