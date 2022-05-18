const { json } = require('express');
const { ObjectId } = require('mongodb');
const fetch = require('node-fetch');
//const model = require('../models/server.model');
const {Key,prefix,domain,agentUsername,whiteLabel} = require('../../Config/key-config');
//const _ = require("lodash");

module.exports.registermember = async (req,res) => {
    let {header, body, params, query} = req;
    let { whiteLabel } = body;
    let option ={
        method :"POST",
        headers:{ "content-type": "application/json" },
        body: JSON.stringify({
            "agentUsername": "99dev",
            "key": "KGq54x_Hx6UUwxku4gT-q",
            "username": "99dev" + "Test0001", //Gen Number
            "password": "123456",
            "web":  whiteLabel
        })
    }
    await fetch(domain + 'ext/CreateUser/' + prefix + '/' + agentUsername , option)
        .then(async res => await res.json())
        .then(result => {
            if(result["code"] === 0){
                res.send({ status: "200" ,message: "success", result}).end();
            }else{
                res.send({ status: "500" ,message: result["msg"]}).end();
            }

        }).catch(error => {
            response.send({ status: "500", message: "internal server error", error: error.message }).end();
        });
    
}