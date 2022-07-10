const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const collectionhistory_log_api = "history_log_api"

module.exports.logs = (body, ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
            .insertOne({
                memb_id: body.agent_id,
                api_name: "11000-create-user",
                ip_address: ip,
                create_date: new Date(moment().format())
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

const { json } = require('express');
const { ObjectId } = require('mongodb');
const fetch = require('node-fetch');


module.exports.registermemberPD = async (req, _user,name,surename) => {
    return new Promise(async (resolve, reject) => {

        let info = req.value
        let option = {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "agentUsername": info.provider.prov_agentusername,
                "key": info.provider.prov_key,
                "username": _user, //Gen Number
                "name":name + " "+ surename, 
                "password": info.prefix + "123456",
                "web": info.provider.prov_whitelabel
            })

        }
        //console.log(option.body)
        console.log("option",option)
        const call = await fetch(info.provider.prov_domain + 'ext/CreateUser/' + info.provider.prov_prefix + '/' + info.provider.prov_agentusername, option)

            .then(async res => await res.json())

            .then(result => resolve({
                result: result,
                password: info.prefix + "123456",
                acct: info.provider.prov_agentusername + info.prefix + info.member.running_number
            }))
            .catch(error => reject(error));
    })


}


module.exports.registermemberPD2 = async (req) => {
    return new Promise(async (resolve, reject) => {
        let info = req.value
        console.log(req)
        let option = {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                value: req
            })
        }
        await fetch('127.0.0.1:45000/registermemberPD', option)
            //console.log(call)
            .then(async res => await res.json())
            .then(result => resolve(result))
            .catch(error => reject(error));
    })


}

module.exports.verifycaptcha = async (captchaID, value) => {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "captchaID": captchaID,
                "value": value
            })

        }

        await fetch("http://localhost" + ":" + "11008/", option)
            .then(async res => await res.json())
            .then(result => resolve(result))
            .catch(error => reject(error));
    })
}



module.exports.Mappingdata = async (body) => {
    return new Promise(async (resolve) => {
        console.log("member", body)
        resolve({
            "requester": body.requester,
            "agent_id": body.agent_id,
            "username": body.username,
            "password": body.password,
            "tel": body.tel,
            "pin": body.pin,
            "line_id": body.line_id,
            "name": body.name,
            "surename": body.surename,
            "birthday": body.birthday,
            "tag": body.tag,
            "channel": body.channel,
            "remark": body.remark,
            "register_ip": body.register_ip,
            "user_reference": body.user_reference,
            "promotion_status": body.promotion_status,
            "bank_id": body.bank_id,
            "bank_acct": body.bank_acct,
            "domain_name": body.domain_name,
            "captchaID": body.captchaID,
            "value": body.value

        },
        )
    })
}