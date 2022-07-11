const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const fetch = require('node-fetch');
const collectionhistory_log_api = "history_log_api"
const { ObjectId } = require('mongodb');

module.exports.logs = (body, ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
            .insertOne({
                memb_id: body.agent_id,
                api_name: "21008-updatestatusdeposit",
                ip_address: ip,
                create_date: new Date(moment().format())
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.depositPD = async (config, username, amount) => {
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

        let url = config.prov_domain + "ext/deposit/" + config.prov_prefix + "/" + config.prov_agentusername;
        //console.log(url, option)
        await fetch(url, option)
            .then(async res => await res.json())
            .then(result => resolve({ result: result }))
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



module.exports.changestatus = async (username,conf) => {
    return new Promise(async (resolve, reject) => {
        let option ={
            method :"POST",
            headers:{ "content-type": "application/json" },
            body: JSON.stringify({
                "agentUsername": conf.prov_agentusername,
                "key": conf.prov_key,
                "username":username, 
                "status":"ACTIVE",
                "whiteLabel":conf.prov_whitelabel,  
                "domain": conf.prov_domain,
                "prefix":conf.prov_prefix
            })
            
        }
           //console.log("http://localhost" + ":" + "45005/changestatus" , option)
            await fetch("http://localhost" + ":" + "45005/changestatus" , option)
            .then(async res => await res.json())
            .then(result => resolve({result:result}))
            .catch(error => reject(error));
        })
}