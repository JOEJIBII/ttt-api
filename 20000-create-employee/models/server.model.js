const { MongoDB } = require('../configs/connection_mongodb');
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const today = dayjs();
const collectionmember = "member"
const collectionCONFIGURATION = "agent"
module.exports.addemployee = (body,payload) => {
    console.log(payload)
    return new Promise(async (resolve, reject) => {

        //console.log(CONF);
        await MongoDB.collection('employee')
            .insertOne({
                pool: [
                    {
                   agent_pool: ObjectId(body.agent_id),
                }
            ],
                username: body.username,
                password: body.password,
                name: body.name,
                tel: body.tel,
                role:ObjectId(body.role),
                avatar:body.avatar,
                status: body.status,
                cr_date: new Date(moment().format()),
                cr_by: payload.username,
                cr_prog: "20000-create-employee",
                upd_date: null,
                upd_by: null,
                upd_prog: null
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.CheckUser = (body) => {
    return new Promise(async (resolve, reject) => {
         await MongoDB.collection('employee')
            .aggregate([{
                $match : {
                    '$and': [
                     { username: body.username },
                 ]},
                }]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}