const { MongoDB } = require('../configs/connection_mongodb');
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const today = dayjs();
const collectionmember = "member-Test"
const collectionCONFIGURATION = "agent"
module.exports.addemployee = (body,ip,_user) => {
    return new Promise(async (resolve, reject) => {

        //console.log(CONF);
        await MongoDB.collection('employee')
            .insertOne({
                pool: [
                    {
                   agent_pool: ObjectId(body.agent_id),
                   role:body.role
                }
            ],
                username: body.username,
                password: body.password,
                name: body.name,
                tel: body.tel,
                status: 'active',
                cr_date: moment().format(),
                cr_by: "20000-create-employee",
                cr_prog: "20000-create-employee",
                upd_date: null,
                upd_by: null,
                upd_prog: null
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}