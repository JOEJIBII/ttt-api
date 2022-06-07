const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const collectionhistory_log_api ="history_log_api"

module.exports.logs = (body,ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
        .insertOne({
            memb_id:body.agent_id,
            api_name:"11009-11009-getbankdeposit",
            ip_address:ip,
            create_date:moment().format()
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.Mappingdata = async (bank) => {
    return new Promise(async (resolve) => {
        //let memb = member
        //console.log("member",Resulttoken)
        resolve({ 
        "bank_account": bank.map(e => {
            return {
                bank_id:Object(e.bank_id),
                bank_account: e.bank_account,
                account_name: e.bank_account_name,
                bank_name_th: e.bank_name_th,
                bank_name_en: e.bank_name_en,
                bank_code: e.bank_code,
                bank_status: e.bank_status
            }
        })
        },)
    })
    }