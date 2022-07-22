const { MongoDB } = require('../configs/connection_mongodb');
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const today = dayjs();
const moment = require('moment');
//const collectionmember = "member"
const collectionCONFIGURATION = "configuration"
const collectionhistory_log_api = "history_log_api"




module.exports.findConF = (body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionCONFIGURATION)
            .aggregate([
                {
                    $match: {
                        $and: [
                            //{ou_id : ObjectId(payload.ou)},
                            //{branch_id : ObjectId(payload.branch)},
                            { domain_name: body.domain_name }
                        ]
                    }
                },

            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.updatebanksuspend = (body, payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent_bank_account')
            .updateOne({ _id: ObjectId(body.account_id), agent_id: ObjectId(body.agent_id) },
                {
                    $set: {
                        bank_auto_status:body.status,
                        upd_date: new Date(moment().format()),
                        upd_by: ObjectId(payload.user_id),
                        upd_prog: "21037-updatestatus-bankauto",
                    }
                })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}