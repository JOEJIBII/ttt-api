const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.historylasted = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    //console.log(payload)
    try {
        let deposit = await model.getdeposit().catch(() => { throw err });
        //console.log(deposit.approve_by)
        
        let withdraw = await model.getwithdraw().catch(() => { throw err });
        //console.log(withdraw)
        let result  = deposit.concat(withdraw);
        result = result.sort(function(a, b){return new Date(b.approve_by.approve_date) - new Date(a.approve_by.approve_date)})
                res.send({
                    status: "200",
                    message: "success",
                    result 
                }).end();

    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

