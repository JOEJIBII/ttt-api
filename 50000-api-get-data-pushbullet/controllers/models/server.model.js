const { ObjectId } = require("mongodb");
const { MongoDB } = require("../build/mongodb");
const moment = require('moment');

module.exports.getPushBulletData = () => {
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection("msg_pushbullet_setting")
            .aggregate([{
                $match: { $and: [{ status: "000" }] }
            }, {
                $project: { _id: "$_id", agent: "$agent_id", name: "$name", identity: "$identity", token: "$token" }
            }])
            .toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.updateStatus = (_id, status) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection("msg_pushbullet_setting")
            .updateOne({ _id }, { $set: { status, upd_by: "IO", upd_date: new Date(), upd_prod: "IO" } })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.insertMsg = data => {
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection("msg_pushbullet")
            .insertOne(data)
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.insert_SMS_dp = (data,agent_id) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection("bank_transaction")
            .insertOne({
              agent_id:ObjectId(agent_id),
              date: moment(data.date).format(),
              time:data.time,
              msg:data.word,
              amount:Number(data.amount),
              channel:data.channel,
              type:data.slip_type,
              from_account_number:data.from_acc,
              from_account_name:data.from_acc_name,
              from_bank_id:data.from_bank_id,
              to_account_number:data.to_acc,
              to_account_name:data.to_acc_name,
              to_bank_id:data.to_bank_id,
              balance:data.balance,
              status:"pending",
              cr_by:"robot",
              cr_date: moment(new Date()).format(),
              cr_prog:"50000 API",
              upd_by:null,
              upd_date: null,
              upd_prog:null
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}