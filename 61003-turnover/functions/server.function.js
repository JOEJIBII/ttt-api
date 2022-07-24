const { MongoDB } = require("../build/mongodb");
const moment = require('moment');
const collectionhistory_log_api ="history_log_api"
const fetch = require('node-fetch');

module.exports.connectSocketIO = async data => {
    return new Promise((resolve, reject) => {
        try {

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}


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


module.exports.checkturnover = async (username,conf,ref_id) => {
    return new Promise(async (resolve, reject) => {
        let option ={
            method :"POST",
            headers:{ "content-type": "application/json" },
            body: JSON.stringify({
                "agentUsername": conf.prov_agentusername,
                "key": conf.prov_key,
                "username":username, 
                "refId": ref_id,
                "whiteLabel":  conf.prov_whitelabel,  
                "domain": conf.prov_domain,
                "prefix":conf.prov_prefix
            })
        }
            console.log("http://taetrueteam.fun" + ":" + "45009/getWinLoseByDepositID" , option)
            await fetch("http://taetrueteam.fun" + ":" + "45009/getWinLoseByDepositID" , option)
            .then(async res => await res.json())
            .then(result => resolve({result:result}))
            .catch(error => reject(error));
        })
}



module.exports.withdraw = async (config, username, amount) => {
    console.log("req",config, username, amount)
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "agentUsername": config.prov_agentusername,
                "key": config.prov_key,
                "username": username,
                "balance": Number(amount),
                "web": config.prov_whitelabel
            })

        }

        let url = config.prov_domain + "ext/withdrawal/" + config.prov_prefix + "/" + config.prov_agentusername;
        console.log(url, option)
        await fetch(url, option)
            .then(async res => await res.json())
            .then(result => resolve({ result: result }))
            .catch(error => reject(error));
    })
}