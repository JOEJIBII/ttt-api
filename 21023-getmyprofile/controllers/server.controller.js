const model = require('../models/server.model');
const functions = require('../functions/server.function');
const { ObjectId } = require('mongodb');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.getmyprofile = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    //console.log("body", req.body)
    const payload = JSON.parse(req.headers.payload)
    console.log("payload", payload)
    try {
        let ResultToken = await model.getmyprofile(payload).catch(() => { throw err });
        if (ResultToken.length !== 0) {
            res.send({
                status: "200",
                message: "success",
                result: {
                    profile_employee: ResultToken[0]
                }
            }).end();
        } else {
            res.send({ status: "202", message: 'not found data' }).end();
        }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}