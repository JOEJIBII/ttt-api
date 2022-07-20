const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");

module.exports.historyprocessing = async function (req, res) {
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
        console.log("pool", pool)
        var agent_id = pool[0].agent_id
        for (var i = 0; i < agent_id.length; i++) {
            console.log("agent_id", agent_id[i])
            deposit = await model.getdeposit(agent_id[i]).catch(() => { throw err });
            withdraw = await model.getwithdraw(agent_id[i]).catch(() => { throw err });

            result = deposit.concat(withdraw);
        }
        result = result.sort(function (a, b) { return new Date(b.upd_date) - new Date(a.upd_date) })

        // let transaction = [...deposit, ...withdraw]
        // transaction = transaction.sort((a, b) => b.cr_date - a.cr_date);

        let skip = (Number(body.page) - 1) * Number(body.range);
        let range = Number(body.range);

        if (result.slice(skip, (skip + range)).length !== 0) {
            res.send({
                status: "200",
                message: "success",
                total: result.length,
                page_option: {
                    total_match: result.length,
                    now_page: Number(body.page),
                    total_match_page: Math.ceil(result.length / range),
                    start_rec: (skip + 1),
                    end_rec: (((skip + range) >= result.length) ? result.length : (skip + range))
                },
                result: result.slice(skip, (skip + range)),
            }).end();
        } else {
            res.send({ status: "201", message: 'not found data' }).end();
        }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

