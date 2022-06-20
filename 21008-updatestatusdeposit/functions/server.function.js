const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const fetch = require('node-fetch');
const collectionhistory_log_api ="history_log_api"
const { ObjectId } = require('mongodb');

module.exports.logs = (body,ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
        .insertOne({
            memb_id:body.agent_id,
            api_name:"21008-updatestatusdeposit",
            ip_address:ip,
            create_date:moment().format()
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.depositPD = async (config,username,amount) => {
    return new Promise(async (resolve, reject) => {
        let option ={
            method :"POST",
            headers:{ "content-type": "application/json" },
            body: JSON.stringify({
                "agentUsername": config.prov_agentusername,
                "key": config.prov_key,
                "username": username, 
                "balance":Number(amount),
                "web":  config.prov_whitelabel
            })
            
        }
            //let { method, params, headers, body, query } = request;
            let url = config.prov_domain + "ext/deposit/" + config.prov_prefix + "/"+ config.prov_agentusername;
            console.log(url,option)
            //let { module, route } = params;
            //headers["payload"] = JSON.stringify(payload);
            //let uQuery = (method !== "POST") ? "?" + Object.keys(query).map(e => e + "=" + query[e]).join("&") : "";
            //let option = (method === "GET" || method === "HEAD" || method === "DELETE") ? { method: method, headers: headers } : { method: method, headers: headers, body: JSON.stringify(body) }
            //await fetch("http://localhost" + ":" + "45002/withdrawPD" , option)
            await fetch(url, option)
            //console.log("http://localhost" + ":" + "45012/getProfileAndCredit" , option)
            .then(async res => await res.json())
            .then(result => resolve({result:result}))
            .catch(error => reject(error));
        })
}


