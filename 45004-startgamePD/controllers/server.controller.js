//const { json } = require('express');
//const { ObjectId } = require('mongodb');
const fetch = require('node-fetch');
const model = require('../model/server.model');
const {Key,prefix,domain,agentUsername,whiteLabel} = require('../../Config/key-config');
//const _ = require("lodash");

module.exports.startgame = async (req,res) => {
    //console.log(JSON.parse(req.headers.payload))
    let conf = await model.getconf(JSON.parse(req.headers.payload)).catch(() => { throw err });
    //console.log(conf)
    let {header, body, params, query} = req;
    let { gameID,gameType,provider,tab } = body;
    let payload = req.headers.payload;
    //console.log(payload[0].username)
    let option ={
        method :"POST",
        headers:{ "content-type": "application/json" },
        body: JSON.stringify({
            "agentUsername": conf[0].prov_agentusername,
            "key": conf[0].prov_key,
            "username": conf[0].username,
            "gameID": gameID,
            "gameType": gameType,
            "provider": provider,
            "redirectUrl": "https://www.google.com",
            "language": "en",
            "tab": tab,
            "web":  conf[0].prov_whitelabel  
        })
        
    }
    const URL = conf[0].prov_domain + 'ext/startGame/' + conf[0].prov_prefix + '/' + conf[0].prov_agentusername
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