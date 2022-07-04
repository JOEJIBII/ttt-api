const model = require('../models/server.model');
const functions = require('../functions/server.function')
const { urlencoded } = require("express");
//const _ = require("lodash");
module.exports.getpushbulletsetting = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    try {
        let type = body.type 
            let result = await model.findpushbulletsetting(body).catch(() => { throw err });
            //let bankwithdraw = await model.bankwithdraw(body.agent_id).catch(() => { throw err });
                if (result && result.length) {
                    res.send({ status: "200", message: "success", result: result }).end();
                } else {
                    res.send({ status: "202", message: 'not found data' }).end();
                }

    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

