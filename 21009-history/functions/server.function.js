const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const fetch = require('node-fetch');
const collectionhistory_log_api ="history_log_api"

module.exports.logs = (body,ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
        .insertOne({
            memb_id:body.agent_id,
            api_name:"21009-history",
            ip_address:ip,
            create_date:moment().format()
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}
