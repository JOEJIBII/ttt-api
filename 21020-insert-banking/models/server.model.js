const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const moment = require('moment');

const { ObjectId, Double } = require('mongodb');
module.exports.insertbank = (body,payload) => {
    console.log(body);
    let _membbank = {

    }
    if(body.memb_bank === null || body.memb_bank === ""){
        _membbank= { memb_bank:""}
    }else{
        _membbank= { memb_bank:ObjectId(body.memb_bank)}
    }
    let _privilege = {

    }
    if(body.privilege === null || body.privilege === ""){
        _privilege= { privilege:null}
    }else{
        _privilege= { privilege:ObjectId(body.privilege)}
    }
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent_bank_account')
            .insertOne({
                agent_id: objectId(body.agent_id),
                bank_id: objectId(body.bank_id),
                account_number: body.bank_account_number,
                account_name:  body.bank_account_name,
                memb_bank:_membbank.memb_bank,
                description:body.description,
                bank_auto_status:"inactive",
                bank_auto_config:null,
                sms_auto_status:"inactive",
                sms_auto_config:null,
                privilege:_privilege.privilege,
                status: body.status,
                type:body.type,
                sub_type:body.type,
                cr_date: new Date(moment().format()),
                cr_by: ObjectId(payload.user_id),
                cr_prog: "21020-insert-banking",
                upd_date: null,
                upd_by: null,
                upd_prog: null
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}
