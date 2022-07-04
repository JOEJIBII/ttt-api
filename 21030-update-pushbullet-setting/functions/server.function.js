const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const collectionhistory_log_api ="history_log_api"
const fetch = require('node-fetch');

module.exports.logs = (body,ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
        .insertOne({
            memb_id:body.agent_id,
            api_name:"21006-getstatus",
            ip_address:ip,
            create_date:new Date(moment().format())
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.getiden = async (req, _user) => {
    return new Promise(async (resolve, reject) => {
        console.log(req)
        let info = req.value
        let option = {
            method: "GET",
            headers: {"content-type": "application/json" ,"Access-Token" :req.token},

        }
        console.log(option)
        //console.log(option.json())
        const call = await fetch("https://api.pushbullet.com/v2/users/me", option)
        
            .then(async res => await res.json())

            .then(result => resolve({
                result: result
                // password: info.prefix + "123456",
                // acct: info.provider.prov_agentusername + info.prefix + info.member.running_number
            }))
            // console.log(error)
            // console.log(call)
            .catch(error => reject(error));
    })


}
