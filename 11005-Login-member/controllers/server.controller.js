const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.login = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
//console.log(JSON.parse(req.headers.payload))
    try {
        let ResultToken = await model.login(req.body,req.headers).catch(() => { throw err });
        // console.log(ResultMEMBER)
        if (ResultToken && ResultToken.length) {
            // console.log('Result',ResultMEMBER)
            const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
            res.send({
                status: "200",
                message: "success",
                 token: ResultToken

            }).end();
        } else {
            res.send({ status: "201", message: 'not found data' }).end();
        }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}