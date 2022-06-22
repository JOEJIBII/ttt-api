const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.changepassword = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    //const body = req.body
    const payload = JSON.parse(req.headers.payload)
    console.log(payload)
    //console.log(body)
    try {
        let Result = await model.updatepassword(payload.user_id, payload.agent_id, req.body.pin).catch(() => { throw err });
        console.log("Result",Result)
        if(Result.modifiedCount === 1){
            res.send({ status: "200", message: 'success' }).end();
        }else{
        res.send({ status: "201", message: 'change password inccorect' }).end();
    }
    } catch (error) {
        //console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}