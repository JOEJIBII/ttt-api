const model = require('../models/server.model');
const functions = require('../functions/server.function')
const { urlencoded } = require("express");
//const _ = require("lodash");
module.exports.getreturnwinlossbyid = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    try {
         let result_summary = await model.getreturnwinloss_summary(body.file_id).catch(() => { throw err });
         let result = await model.getreturnwinloss_transaction(body.file_id).catch(() => { throw err });
        if (result && result.length) {
            console.log(result)
            res.send({ status: "200", message: "success", summary: result_summary[0] ,transaction: result  }).end();
        } else {
            res.send({ status: "202", message: 'not found data' }).end();
        }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

