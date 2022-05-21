const { json } = require('express');
const { ObjectId } = require('mongodb');
const fetch = require('node-fetch');
//const model = require('../models/server.model');
//const {Key,prefix,domain,agentUsername,whiteLabel} = require('../../Config/key-config');
//const _ = require("lodash");

module.exports.registermemberPD = async (req,res) => {
    console.log(req)
    let info = req.body.value 
    let option = {
        method :"POST",
        headers:{ "content-type": "application/json" },
        body: JSON.stringify({
            "agentUsername": info.provider.prov_agentusername,
            "key": info.provider.prov_key,
            "username": info.provider.prov_agentusername + info.prefix + info.member.running_number, //Gen Number
            "password": info.provider.provider_name + "123456" ,
            "web":  info.provider.prov_whitelabel
        })
    }
    await fetch(info.provider.prov_domain + 'ext/CreateUser/' + info.provider.prov_prefix + '/' + info.provider.prov_agentusername , option)
        .then(async res => await res.json())
        
        .then(result => {
            if(result["code"] === 0){
                res.send({ status: "200" ,message: "success", result}).end();
            }else{
                
                res.send({ status: "200" ,message: result["msg"]}).end();
            }

        }).catch(error => {
            console.log('result',result)
            console.log('error',error)
            response.send({ status: "500", message: "internal server error", error: error.message }).end();
        });
    
}