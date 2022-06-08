const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const collectionhistory_log_api ="history_log_api"
const fetch = require('node-fetch');

module.exports.logs = (body,ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
        .insertOne({
            memb_id:body.agent_id,
            api_name:"21001-login-employee",
            ip_address:ip,
            create_date:moment().format()
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}



module.exports.Mappingdata = async (Resulttoken,balance) => {
    return new Promise(async (resolve) => {
        //let memb = member
        //console.log("member",Resulttoken)
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
                "channel": Resulttoken.profile_mem.profile.channel,
                "note": Resulttoken.profile_mem.profile.note
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