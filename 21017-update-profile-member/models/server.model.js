const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');

const { ObjectId, Double } = require('mongodb');
module.exports.updatemember = (body,payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member-Test')
            .updateOne({ _id: ObjectId(body.memb_id),agent_id:ObjectId(body.agent_id) },
                {
                    $set: {
                        "username" : body.username,
                        "password" : body.password,
                        "tel" : body.tel,
                        "mobile_no" : body.mobile_no,
                        "pin" : body.pin,
                        "line_id" : body.line_id,
                        "name" : body.name,
                        "surname" : body.surename,
                        "birthday_date" : body.birthday,
                        "tag" :body.tag,
                        "channel" : ObjectId(body.channel),
                        "remark" : body.remark,
                        "register_ip" : body.register_ip,
                        "register_date" :new Date(moment(body.register_date).format()),
                        "user_reference" : body.user_reference,
                        "promotion_status" : body.promotion_status,
                        "privilege" : ObjectId(body.privilege),
                        "financial.deposit_first_time_amount" : Double(body.deposit_first_time_amount),
                        "financial.deposit_first_time" : new Date(moment(body.deposit_first_time).format()),
                        "financial.deposit_count" : Double(body.deposit_count),
                        "financial.deposit_total_amount" : Double(body.deposit_total_amount),
                        "financial.withdraw_first_time" : new Date(moment(body.withdraw_first_time).format()),
                        "financial.withdraw_count" : Double(body.withdraw_count),
                        "financial.withdraw_total_amount" : Double(body.withdraw_total_amount),
                        "status" : body.status,
                        "upd_date" : new Date(moment().format()),
                        "upd_by" : payload.user_id,
                        "upd_prog" : "21017-update-profile-member"
                    }
                })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}
