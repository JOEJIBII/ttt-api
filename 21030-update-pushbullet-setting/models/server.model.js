const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const moment = require('moment');
const { ObjectId, Double } = require('mongodb');
module.exports.updatepush = (body, payload,iden) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('msg_pushbullet_setting')
            .updateOne({ name:body.name, agent_id: ObjectId(body.agent_id) },
                {
                    $set: {
                        agent_id : ObjectId(body.agent_id),
                        name : body.name,
                        identity : iden,
                        password : body.password,
                        token : body.token,
                        status : body.status,
                        cr_date: new Date(moment().format()),
                        cr_by: ObjectId(payload.user_id),
                        cr_prog: "21030-update-pushbullet-setting",
                        upd_date: new Date(moment().format()),
                        upd_by: ObjectId(payload.user_id),
                        upd_prog: "21030-update-pushbullet-setting",
                    }
                },{upsert:true})
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}