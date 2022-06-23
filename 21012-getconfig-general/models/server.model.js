const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');

const { ObjectId } = require('mongodb');
module.exports.getconfiggeneral = (agent_id) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent')
            .aggregate([
               { $match: {
                    $and: [{
                        _id: ObjectId(agent_id),
                    },]
                }
            },

        {
            $project: {
                _id: 1,
                prefix: "$provider.prov_agentusername",
                url_login: "$url_login",
                partner_url: "$partner_url",
                limit_ip:"$limit_ip",
                user_template:"$prefix",
                lastuser:"$member.running_number",
                deposit_min:"$deposit_config.min_cash_limit",
                deposit_max:"$deposit_config.max_cash_limit",
                withdraw_min:"$withdraw_config.min_cash_limit",
                withdraw_max:"$withdraw_config.max_cash_limit",
                withdraw_limit_round:"$withdraw_config.counter",
                withdraw_amount_select:"$withdraw_config.amount_select"
            }
        }

            ]).toArray()
        .then(result => resolve(result))
        .catch(error => reject(error));


});
}
