const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");

module.exports.banktransaction = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    //console.log(payload)
    try {
        let get_transaction = await model.getbanktransaction(body.account_id).catch(() => { throw err });
        let get_bank = await model.getbank(body.account_id).catch(() => { throw err });
        res.send({
            status: "200",
            message: "success",
            total:get_transaction.length,
            result: {
                bank:get_bank[0],
                transaction:get_transaction
            },
        }).end();



    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

