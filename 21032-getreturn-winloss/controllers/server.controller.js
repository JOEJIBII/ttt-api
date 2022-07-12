const model = require('../models/server.model');
const functions = require('../functions/server.function')
const { urlencoded } = require("express");
//const _ = require("lodash");
module.exports.getreturnwinloss = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    //const body = req.body
    try {

        
        let pool = await model.getagent_id(payload.user_id).catch(() => { throw err });
        let result = []
        //console.log(pool)
        var agent_id = pool[0].agent_id
        let temp = []
        for (var i=0; i < agent_id.length; i++) {
            //console.log(agent_id[i])
            result = await model.getreturnwinloss(agent_id[i]).catch(() => { throw err });
            temp  = result.concat(temp);
         }
        result = temp
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

