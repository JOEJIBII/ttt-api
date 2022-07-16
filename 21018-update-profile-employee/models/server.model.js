const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');
const moment = require('moment');
const { ObjectId, Double } = require('mongodb');
module.exports.updateemp = (body, payload) => {
    console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('employee')
            .updateOne({ _id: ObjectId(body.user_id)},
                {
                    $set: {
                        //"pool": body.web_access,
                        "password": body.password,
                        "name": body.name,
                        "tel": body.tel,
                        "role": ObjectId(body.role),
                        "status": body.status,
                        "upd_date": new Date(moment().format()),
                        "upd_by": ObjectId(payload.user_id),
                        "upd_prog": "21018-update-profile-employee"
                    }
                })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}
