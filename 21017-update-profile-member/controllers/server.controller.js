const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.updateprofile = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    try {
        console.log("body.agent_id", body.agent_id)
        let Result = await model.updatemember(body,payload).catch(() => { throw err });
        //console.log(Result)
        if (Result.modifiedCount === 1) {
            const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
            res.send({
                status: "200",
                message: "success",
                //result_config:Result
            }).end();
        } else {
            res.send({ status: "201", message: 'update unsuccessful' }).end();
        }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}
