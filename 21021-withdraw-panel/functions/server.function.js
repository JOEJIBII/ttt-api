const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const fetch = require('node-fetch');
const collectionhistory_log_api ="history_log_api"

module.exports.logs = (body,ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
        .insertOne({
            memb_id:body.agent_id,
            api_name:"11001-getdetail-member",
            ip_address:ip,
            create_date:new Date(moment().format())
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
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
                "status":"SUSPEND",
                "whiteLabel":  conf.prov_whitelabel,  
                "domain": conf.prov_domain,
                "prefix":conf.prov_prefix
            })
            
        }
            //let { method, params, headers, body, query } = request;
            //let { module, route } = params;
            //headers["payload"] = JSON.stringify(payload);
            //let uQuery = (method !== "POST") ? "?" + Object.keys(query).map(e => e + "=" + query[e]).join("&") : "";
            //let option = (method === "GET" || method === "HEAD" || method === "DELETE") ? { method: method, headers: headers } : { method: method, headers: headers, body: JSON.stringify(body) }
            console.log("http://localhost" + ":" + "45005/changestatus" , option)
            await fetch("http://localhost" + ":" + "45005/changestatus" , option)
            //console.log("http://localhost" + ":" + "45012/getProfileAndCredit" , option)
            .then(async res => await res.json())
            .then(result => resolve({result:result}))
            .catch(error => reject(error));
        })
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
            console.log("http://localhost" + ":" + "45009/getWinLoseByDepositID" , option)
            await fetch("http://localhost" + ":" + "45009/getWinLoseByDepositID" , option)
            .then(async res => await res.json())
            .then(result => resolve({result:result}))
            .catch(error => reject(error));
        })
}

module.exports.logs = (body,ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
        .insertOne({
            memb_id:body.agent_id,
            api_name:"11001-getdetail-member",
            ip_address:ip,
            create_date:new Date(moment().format())
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.ProfilePD = async (username,config) => {
    return new Promise(async (resolve, reject) => {
        let option ={
            method :"POST",
            headers:{ "content-type": "application/json" },
            body: JSON.stringify({
                "agentUsername": config.prov_agentusername,
                "key": config.prov_key,
                "username": username, 
                "web":  config.prov_whitelabel 
            })
            
        }
          await fetch("http://localhost" + ":" + "45012/getProfileAndCredit" , option)
           
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


module.exports.Mappingdata = async (memb,provider) => {
    return new Promise(async (resolve) => {
        console.log("member",memb)
        resolve({ 
            "_id": memb._id,
            "username": memb.username,
            "line_id": memb.line_id,
            "tel": memb.tel,
            "profile": {
                "name": memb.profile.name,
                "surename": memb.profile.surename,
                "mobile_number": memb.profile.mobile_number,
                "channel": memb.profile.channel,
                "note": memb.profile.note
            },
            "banking_account": [
                {
                    "bank_id": memb.banking_account.bank_id,
                    "bank_acct": memb.banking_account.bank_acct,
                    "bank_name": memb.banking_account.bank_name,
                    "bank_code": memb.banking_account.bank_code,
                    "bank_status": memb.banking_account.bank_status
                }
            ],
            "financial": {
                "deposit_first_time_amount": memb.financial.deposit_first_time_amount,
                "deposit_first_time": memb.financial.deposit_first_time,
                "deposit_count": memb.financial.deposit_count,
                "deposit_total_amount": memb.financial.deposit_total_amount,
                "withdraw_first_time": memb.financial.withdraw_first_time,
                "withdraw_count": memb.financial.withdraw_count,
                "withdraw_total_amount": memb.financial.withdraw_total_amount
            },
            "PD":{
                "username": provider.username,
                "credit": provider.balance,
                "currency": provider.currency,
                    "hdp": provider.outStandingAmt.hdp,
                    "mixParlay": provider.outStandingAmt.mixParlay,
                    "mixStep": provider.outStandingAmt.mixStep,
                    "casino": provider.outStandingAmt.casino,
                    "slot": provider.outStandingAmt.slot,
                    "card": provider.outStandingAmt.card,
                    "lotto": provider.outStandingAmt.lotto,
                    "keno": provider.outStandingAmt.keno,
                    "trade": provider.outStandingAmt.trade,
                    "poker": provider.outStandingAmt.poker
            },
            "status": memb.status,
            "create_date": memb.create_date,
            "update_date": memb.update_date,
            "update_by": memb.update_by,
        },
        )
    })
    }
