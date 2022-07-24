const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const moment = require('moment');
const { ObjectId, Double } = require('mongodb');
module.exports.updatebank = (body, payload) => {
    console.log(body);
    let _membbank = {

    }
    if (body.memb_bank === null || body.memb_bank === "") {
        _membbank = { memb_bank: "" }
    } else {
        _membbank = { memb_bank: ObjectId(body.memb_bank) }
    }
    let _privilege = {

    }
    if(body.privilege === null || body.privilege === ""){
        _privilege= { privilege:null}
    }else{
        _privilege= { privilege:(body.privilege)}
    }
    var qrcode = null
    if(body.qr_code === null && body.qr_code === ""){
        qrcode = null
    }else{
        qrcode = body.qr_code
    }
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent_bank_account')
            .updateOne({ _id: ObjectId(body._id), agent_id: ObjectId(body.agent_id) },
                {
                    $set: {
                        bank_id: objectId(body.bank_id),
                        account_number: body.bank_account_number,
                        account_name: body.bank_account_name,
                        memb_bank: _membbank.memb_bank,
                        description: body.description,
                        qr_code:qrcode,
                        privilege: _privilege.privilege,
                        status: body.status,
                        type: body.type,
                        sub_type: body.type,
                        upd_date: new Date(moment().format()),
                        upd_by: ObjectId(payload.user_id),
                        upd_prog: "21019-update-banking",
                    }
                })
            // .insertOne({
            //     bank_id: objectId(body.bank_id),
            //     account_number: body.bank_account_number,
            //     account_name: body.bank_account_name,
            //     memb_bank: _membbank.memb_bank,
            //     description: body.description,
            //     privilege: body.privilege,
            //     status: body.status,
            //     type: body.type,
            //     sub_type: body.type,
            //     upd_date: new Date(moment().format()),
            //     upd_by: ObjectId(payload.user_id),
            //     upd_prog: "21020-insert-banking",
            // })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}
