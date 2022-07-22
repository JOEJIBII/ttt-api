const model = require('../models/server.model');
const functions = require('../functions/server.function')
const { urlencoded } = require("express");
//const _ = require("lodash");

module.exports.updatestatusauto = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    try {
        let type = body.type
        let updatebank = await model.updatebanksuspend(body,payload).catch(() => { throw err });
        //let bankwithdraw = await model.bankwithdraw(body.agent_id).catch(() => { throw err });
            if (updatebank.modifiedCount === 1 && updatebank.matchedCount > 0) {
                res.send({ status: "200", message: "success", result: updatebank }).end();
            } else if(updatebank.modifiedCount === 0 && updatebank.matchedCount > 0) {
                res.send({ status: "202", message: 'ไม่มีการอัพเดทข้อมูล', result: updatebank   }).end();
            }else{
                res.send({ status: "201", message: 'update unsuccessful' ,result: updatebank  }).end();
            }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}