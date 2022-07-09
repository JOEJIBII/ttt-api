const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.history = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    //console.log(payload)
    try {
        
        let deposit = null
        let withdraw = null
        let pool = await model.getagent_id(payload.user_id).catch(() => { throw err });
        let result = []
        console.log(pool)
        var agent_id = pool[0].agent_id
        for (var i=0; i < agent_id.length; i++) {
            console.log(agent_id[i])
            deposit = await model.getdeposit(agent_id[i]).catch(() => { throw err });
            withdraw = await model.getwithdraw(agent_id[i]).catch(() => { throw err });
           
            result  = deposit.concat(withdraw);
         }
        result = result.sort(function(a, b){return new Date(b.request_date) - new Date(a.request_date)})
                res.send({
                    status: "200",
                    message: "success",
                    total: result.length,
                    result 
                }).end();

    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

