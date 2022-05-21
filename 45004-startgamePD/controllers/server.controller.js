//const { json } = require('express');
//const { ObjectId } = require('mongodb');
const fetch = require('node-fetch');
//const model = require('../models/server.model');
const {Key,prefix,domain,agentUsername,whiteLabel} = require('../../Config/key-config');
//const _ = require("lodash");

module.exports.startgame = async (req,res) => {
    console.log("IN OUT ")
    let {header, body, params, query} = req;
    let { gameID,gameType,provider,tab,username,whiteLabel } = body;
    let option ={
        method :"POST",
        headers:{ "content-type": "application/json" },
        body: JSON.stringify({
            "agentUsername": agentUsername,
            "key": Key,
            "username": username, 
            "gameID": gameID,
            "gameType": gameType,
            "provider": provider,
            "redirectUrl": "https://www.google.com",
            "language": "en",
            "tab": "Card",
            "web":  whiteLabel  
        })
        
    }
    const URL = domain + 'ext/startGame/' + prefix + '/' + agentUsername
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