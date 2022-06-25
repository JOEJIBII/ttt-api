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
            create_date:new Date(moment().format())
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

module.exports.Mappingdata = async (Resulttoken,balance,token) => {
    return new Promise(async (resolve) => {
        //let memb = member
        //console.log("member",Resulttoken)
        resolve({ 
        "token":token.token,
        "profile_mem": {
            "_id": Resulttoken[0]._id,
            "username": Resulttoken[0].username,
            "agent_id": Resulttoken[0].agent_id,
            "line_id": Resulttoken[0].line_id,
            "profile": {
                "name": Resulttoken[0].profile.name,
                "surename": Resulttoken[0].profile.surename,
                "tel": Resulttoken[0].profile.tel,
                "channel_id": Resulttoken[0].profile.channel_id,
                "channel": Resulttoken[0].profile.channel,
                "note": Resulttoken[0].profile.note,
                "birthday_date": Resulttoken[0].profile.birthday_date,
                "privilege": Resulttoken[0].profile.privilege,
                "user_reference": Resulttoken[0].profile.user_reference,      
            },
            "banking_account": Resulttoken[0].banking_account,
            "financial": Resulttoken[0].financial,
            "PD":{
                "credit":balance
            },
            "status": Resulttoken[0].status,
            "status_newmember": Resulttoken[0].status_newmember,
            "create_date": Resulttoken[0].create_date,
            "update_date": Resulttoken[0].update_date,
            "update_by": Resulttoken[0].update_by
        }
        },)
    })
    }