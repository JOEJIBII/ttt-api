//const { json } = require('express');
//const { ObjectId } = require('mongodb');
const fetch = require('node-fetch');
//const model = require('../models/server.model');
//const {Key,prefix,domain,agentUsername,whiteLabel} = require('../../Config/key-config');
//const _ = require("lodash");

module.exports.getWinLoseByDepositID = async (req,res) => {
    let {header, body, params, query} = req;
    let { refId,username,agentUsername,key,whiteLabel,prefix,domain } = body;
    let option ={
        method :"POST",
        headers:{ "content-type": "application/json" },
        body: JSON.stringify({
            "agentUsername": agentUsername,
            "key": key,
            "username": username, 
            "refId":refId,
            "web":  whiteLabel  
        })
        
    }
    const URL = domain + 'ext/getWinLoseByDepositID/' + prefix + '/' + agentUsername
    console.log(URL , option);

    await fetch(URL , option)
        .then(async res => await res.json())
        .then(result => {
            if(result["code"] === 0){
                res.send({ status: "200" ,message: "success", result}).end();
            }else{
                res.send({ status: "400" ,message: result,option,URL}).end();
            }

        }).catch(error => {
            response.send({ status: "500", message: "internal server error", error: error.message }).end();
        });
    
}