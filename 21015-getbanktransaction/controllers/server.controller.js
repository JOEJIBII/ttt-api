const model = require('../models/server.model');
const functions = require('../functions/server.function')
const { urlencoded } = require("express");
//const _ = require("lodash");
module.exports.getbanktrnsaction = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    try {
        let type = body.type
        let getlimitdeposit = await model.getlimitdeposit(body.agent_id).catch(() => { throw err });
        let bankdeposit = await model.bankdeposit(body.agent_id).catch(() => { throw err });
        let bankwithdraw = await model.bankwithdraw(body.agent_id).catch(() => { throw err });
        if (type === "deposit") {
            if (bankdeposit && bankdeposit.length) {
                res.send({ status: "200", message: "success", result: bankdeposit ,limit_of_silp_deposit:limit_of_silp_deposit[0]}).end();
            } else {
                res.send({ status: "201", message: 'not found data' }).end();
            }
        } else {
            if (type === "withdraw") {
                if (bankwithdraw && bankwithdraw.length) {
                    res.send({ status: "200", message: "success", result: bankwithdraw }).end();
                } else {
                    res.send({ status: "201", message: 'not found data' }).end();
                }
            } else {
                if (type === "all") {
                    if (bankwithdraw.length !== 0 && bankdeposit.length !== 0) {
                        res.send({
                            status: "200", message: "success", result: bankwithdraw.concat(bankdeposit)
                        }).end();
                    } else {
                        if (bankwithdraw.length !== 0) {
                            res.send({ status: "200", message: "success", result: bankwithdraw }).end();
                        } else {
                            if (bankdeposit.length !== 0) {
                                res.send({ status: "200", message: "success", result: bankdeposit }).end();
                            } else {
                                res.send({ status: "201", message: 'not found data' }).end();
                            }
                        }
                        res.send({ status: "201", message: 'not found data' }).end();
                    }
                } else {
                    res.send({ status: "202", message: 'cannot found type' }).end();
                }
            }
        }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

