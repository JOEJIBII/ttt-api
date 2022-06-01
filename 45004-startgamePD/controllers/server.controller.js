//const { json } = require('express');
//const { ObjectId } = require('mongodb');
const fetch = require('node-fetch');
const model = require('../model/server.model');
const functions = require('../functions/server.function');
const {Key,prefix,domain,agentUsername,whiteLabel} = require('../../Config/key-config');
//const _ = require("lodash");

module.exports.startgame = async (req,res) => {
    //console.log(JSON.parse(req.headers.payload))
    let conf = await model.getconf(JSON.parse(req.headers.payload)).catch(() => { throw err });
    //console.log(conf)
    let {header, body, params, query} = req;
    let { gameID,gameType,provider,tab } = body;
    let payload = JSON.parse(req.headers.payload);
    let username = payload.username
    console.log(payload)
    console.log(username)
    let option = {}
    if(req.body.tab === "Sports"){
        option ={
            method :"POST",
            headers:{ "content-type": "application/json" },
            body: JSON.stringify({
                "agentUsername": conf[0].prov_agentusername,
                "key": conf[0].prov_key,
                "username": payload.username,
                "web":  conf[0].prov_whitelabel  
            }) 
    }
    }else{
         option ={
            method :"POST",
            headers:{ "content-type": "application/json" },
            body: JSON.stringify({
                "agentUsername": conf[0].prov_agentusername,
                "key": conf[0].prov_key,
                "username": payload.username,
                "gameID": gameID,
                "gameType": gameType,
                "provider": provider,
                "redirectUrl": "https://www.google.com",
                "language": "en",
                "tab": tab,
                "web":  conf[0].prov_whitelabel  
            }) 
    }
    
    }
    let URL = ""
    if(req.body.tab === "Sports"){
        URL = conf[0].prov_domain + 'ext/redirectLogin/' + conf[0].prov_prefix + '/' + conf[0].prov_agentusername
    }else{
        URL = conf[0].prov_domain + 'ext/startGame/' + conf[0].prov_prefix + '/' + conf[0].prov_agentusername
    }
    
    console.log(URL , option);

    await fetch(URL , option)
        .then(async res => await res.json())
         
        .then(result => {
           
            if(result["code"] === 0){
                let uri = ""
                console.log(result)
                if(req.body.tab === "Sports"){
                    uri = result.url + "&rdPage=sports"
                }else{
                    uri = result.data.uri
                }
                res.send({ status: "200" ,message: "success", uri}).end();
            }else{
                res.send({ status: "400" ,message: result,option,URL}).end();
            }

        }).catch(error => {
            res.send({ status: "500", message: "internal server error", error: error.message }).end();
        });
    
}