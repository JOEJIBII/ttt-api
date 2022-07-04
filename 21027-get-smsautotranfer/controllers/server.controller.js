const model = require('../models/server.model');
const functions = require('../functions/server.function')
const { urlencoded } = require("express");
//const _ = require("lodash");
module.exports.getsmsautotranfer = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    try {
        let type = body.type 
        let getbankid = await model.getbankid(body).catch(() => { throw err });
        if(getbankid.length > 0){
            let getautotranfer = await model.getautotranfer(body,getbankid[0]._id).catch(() => { throw err });
            //let bankwithdraw = await model.bankwithdraw(body.agent_id).catch(() => { throw err });
                if (getautotranfer && getautotranfer.length) {
                    res.send({ status: "200", message: "success", result: getautotranfer }).end();
                } else {
                    res.send({ status: "202", message: 'not found data' }).end();
                }
        }else{
            res.send({ status: "202", message: 'not found data bank code' }).end();
        }
        
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

