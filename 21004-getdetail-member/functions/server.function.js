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
            create_date:moment().format()
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.ProfilePD = async (username) => {
    return new Promise(async (resolve, reject) => {
        let option ={
            method :"POST",
            headers:{ "content-type": "application/json" },
            body: JSON.stringify({
                "agentUsername": "99dev",
                "key": "KGq54x_Hx6UUwxku4gT-q",
                "username": '99dev' + username, 
                "web":  "gb711"  
            })
            
        }
            //let { method, params, headers, body, query } = request;
            //let { module, route } = params;
            //headers["payload"] = JSON.stringify(payload);
            //let uQuery = (method !== "POST") ? "?" + Object.keys(query).map(e => e + "=" + query[e]).join("&") : "";
            //let option = (method === "GET" || method === "HEAD" || method === "DELETE") ? { method: method, headers: headers } : { method: method, headers: headers, body: JSON.stringify(body) }
            await fetch("http://localhost" + ":" + "45012/getProfileAndCredit" , option)
            //console.log("http://localhost" + ":" + "45012/getProfileAndCredit" , option)
            .then(async res => await res.json())
            .then(result => resolve({result:result}))
            .catch(error => reject(error));
        })
}



module.exports.Mappingdata = async (memb,provider) => {
    return new Promise(async (resolve) => {
        //let memb = member
        console.log("member",memb)
        resolve({ 
            profile_mem:{
                "_id": memb._id,
                "username": memb.username,
                "line_id": memb.line_id,
                "tel": memb.tel,
                "web_id": memb.web_id,
                "web_name": memb.web_name,
                    "name": memb.profile.name,
                    "surename": memb.profile.surename,
                    "birthday_date": memb.profile.birthday_date,
                    "pin":memb.profile.pin,
                    "register_ip":memb.profile.register_ip,
                    "user_reference":memb.profile.user_reference,
                    "privilege":memb.profile.privilege,
                    "email":memb.profile.email,
                    "mobile_number": memb.profile.mobile_number,
                    "channel": memb.profile.channel,
                    "channel_id": memb.profile.channel_id,
                    "note": memb.profile.note,
                "banking_account": memb.banking_account[0],
                "financial": {
                    "deposit_first_time_amount": memb.financial.deposit_first_time_amount,
                    "deposit_first_time": memb.financial.deposit_first_time,
                    "deposit_count": memb.financial.deposit_count,
                    "deposit_total_amount": memb.financial.deposit_total_amount,
                    "withdraw_first_time": memb.financial.withdraw_first_time,
                    "withdraw_count": memb.financial.withdraw_count,
                    "withdraw_total_amount": memb.financial.withdraw_total_amount
                },
                "pd":{
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
            }
            
        },
        )
    })
    }
