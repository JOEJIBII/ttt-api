const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');

const { ObjectId, Double } = require('mongodb');
module.exports.updateconfgenneral = (body) => {
    console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('agent')
            .updateOne({ _id: ObjectId(body.agent_id), },
                {
                    $set: {
                        "provider.prov_agentusername": body.prefix,
                        "url_login": body.url_login,
                        "partner_url": body.partner_url,
                        "limit_ip": body.limit_ip,
                        "prefix": body.user_template,
                        "member.running_number": Double(body.lastuser),
                        "deposit_config.min_cash_limit": Double(body.deposit_min),
                        "deposit_config.max_cash_limit": Double(body.deposit_max),
                        "withdraw_config.min_cash_limit": Double(body.withdraw_min),
                        "withdraw_config.max_cash_limit": Double(body.withdraw_max),
                        "withdraw_config.counter": Double(body.withdraw_limit_round),
                        "withdraw_config.amount_select": body.withdraw_amount_select
                    }
                })
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}
