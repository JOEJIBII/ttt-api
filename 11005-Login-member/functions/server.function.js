const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const collectionhistory_log_api ="history_log_api"
const fetch = require('node-fetch');

module.exports.logs = (body,ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
        .insertOne({
            memb_id:body.agent_id,
            api_name:"11005-login",
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
                "username":'99dev'+ username, 
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

module.exports.Mappingdata = async (Resulttoken,balance) => {
    return new Promise(async (resolve) => {
        //let memb = member
        console.log("member",Resulttoken)
        resolve({ 
        "token": Resulttoken.token,
        "profile_mem": {
            "_id": Resulttoken.profile_mem._id,
            "username": Resulttoken.profile_mem.username,
            "agent_id": Resulttoken.profile_mem.agent_id,
            "line_id": Resulttoken.profile_mem.line_id,
            "profile": {
                "name": Resulttoken.profile_mem.profile.name,
                "surename": Resulttoken.profile_mem.profile.surename,
                "tel": Resulttoken.profile_mem.profile.tel,
                "channel_id": Resulttoken.profile_mem.profile.channel_id,
                "channel": Resulttoken.profile_mem.profile.channel.channel,
                "note": Resulttoken.profile_mem.profile.note,
                "birthday_date": Resulttoken.profile_mem.profile.birthday_date,
                "privilege": Resulttoken.profile_mem.profile.privilege,
                "user_reference": Resulttoken.profile_mem.profile.user_reference,      
            },
            "banking_account": Resulttoken.profile_mem.banking_account,
            "financial": Resulttoken.profile_mem.financial,
            "PD":{
                "credit":balance
            },
            "status": Resulttoken.profile_mem.status,
            "status_newmember": Resulttoken.profile_mem.status_newmember,
            "create_date": Resulttoken.profile_mem.create_date,
            "update_date": Resulttoken.profile_mem.update_date,
            "update_by": Resulttoken.profile_mem.update_by
        }
        },)
    })
    }