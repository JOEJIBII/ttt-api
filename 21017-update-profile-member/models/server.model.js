const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const moment = require('moment');

const { ObjectId, Double } = require('mongodb');
module.exports.updatemember = (body, payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member')
            .updateOne({ _id: ObjectId(body.memb_id), agent_id: ObjectId(body.agent_id) },
                {
                    $set: {
                        "username": body.username,
                        "password": body.password,
                        "tel": body.tel,
                        "mobile_no": body.mobile_no,
                        "pin": body.pin,
                        "line_id": body.line_id,
                        "name": body.name,
                        "surname": body.surename,
                        "birthday_date": body.birthday,
                        "tag": body.tag,
                        "channel": ObjectId(body.channel),
                        "remark": body.remark,
                        "ipinfo": body.ipinfo,
                        "register_date": new Date(moment(body.register_date).format()),
                        "user_reference": body.user_reference,
                        "promotion_status": body.promotion_status,
                        "privilege": ObjectId(body.privilege),
                        "status": body.status,
                        "upd_date": new Date(moment().format()),
                        "upd_by": payload.user_id,
                        "upd_prog": "21017-update-profile-member"
                    }
                })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}

module.exports.updatebankmemb = (body, payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_bank_account')
            .updateOne({ memb_id: ObjectId(body.memb_id), agent_id: ObjectId(body.agent_id) },
                {
                    $set: {
                        "status": "inactive",
                        "upd_date": new Date(moment().format()),
                        "upd_by": payload.user_id,
                        "upd_prog": "21017-update-profile-member"
                    }
                })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}

module.exports.insertbankmemb = (body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_bank_account')
            .insertOne({
                memb_id: ObjectId(body.memb_id),
                agent_id: ObjectId(body.agent_id),
                bank_id: ObjectId(body.bank_id),
                account_number: body.bank_acctount,
                account_name: body.name + " " + body.surename,
                description: null,
                status: "active",
                cr_by: "21017-update-profile-member",
                cr_date: new Date(moment().format()),
                cr_prog: "21017-update-profile-member",
                upd_by: null,
                upd_date: null,
                upd_prog: null
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.getbankmemb = (body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_bank_account')
            .aggregate([
                {
                    $match: {
                        $and: [
                            { agent_id: ObjectId(body.agent_id) },
                            { member_id: ObjectId(body.memb_id) },
                        ]
                    }
                },
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}