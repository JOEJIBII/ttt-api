const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.history = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    //console.log(payload)
    try {
        let deposit = await model.getdeposit().catch(() => { throw err });
        let withdraw = await model.getwithdraw().catch(() => { throw err });
        let result  = deposit.concat(withdraw);
        result = result.sort(function(a, b){return new Date(a.request_date) - new Date(b.request_date)})
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

