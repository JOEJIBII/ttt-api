const model = require('../models/server.model');
const functions = require('../functions/server.function')
const { urlencoded } = require("express");
//const _ = require("lodash");
module.exports.getallbanksetting = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    try {
        let type = body.type
        let bankdeposit = await model.bankdeposit(body.agent_id).catch(() => { throw err });
        //let bankwithdraw = await model.bankwithdraw(body.agent_id).catch(() => { throw err });
            if (bankdeposit && bankdeposit.length) {
                res.send({ status: "200", message: "success", result: bankdeposit }).end();
            } else {
                res.send({ status: "201", message: 'not found data' }).end();
            }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

