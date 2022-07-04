const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const moment = require('moment');
const { ObjectId, Double } = require('mongodb');
module.exports.updatesmsactive = (body, payload) => {
    console.log(body);
    // let bank_auto_config = {

    // }
    // if (body.bank_auto_config === null || body.bank_auto_config === "") {
    //     bank_auto_config = { bank_auto_config: null }
    // } else {
    //     bank_auto_config = { bank_auto_config: body.bank_auto_config }
    // }
    let sms_auto_config = {

    }
    if (body.sms_auto_config === null || body.sms_auto_config === "") {
        sms_auto_config = { sms_auto_config: null }
    } else {
        sms_auto_config = { sms_auto_config: body.sms_auto_config }
    }
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent_bank_account')
            .updateOne({ _id: ObjectId(body._id), agent_id: ObjectId(body.agent_id) },
                {
                    $set: {
                        //bank_id: objectId(body.bank_id),
                        // bank_auto_status:body.bank_auto_status,
                        // bank_auto_config:bank_auto_config.bank_auto_config,
                        sms_auto_status:body.sms_auto_status,
                        sms_auto_config:sms_auto_config.sms_auto_config,
                        type: body.type,
                        sub_type: body.type,
                        upd_date: new Date(moment().format()),
                        upd_by: ObjectId(payload.user_id),
                        upd_prog: "21026-update-bankautotranfer",
                    }
                })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}
module.exports.updatesmsinactive = (body, payload) => {
    console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent_bank_account')
            .updateOne({ _id: ObjectId(body._id), agent_id: ObjectId(body.agent_id) },
                {
                    $set: {
                        bank_id: objectId(body.bank_id),
                        // bank_auto_status:body.bank_auto_status,
                        // bank_auto_config:null,
                        sms_auto_status:body.sms_auto_status,
                        sms_auto_config:null,
                        type: body.type,
                        sub_type: body.type,
                        upd_date: new Date(moment().format()),
                        upd_by: ObjectId(payload.user_id),
                        upd_prog: "21026-update-bankautotranfer",
                    }
                })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}