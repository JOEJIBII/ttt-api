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

        let result = []
        // console.log(pool)
        // var agent_id = pool[0].agent_id
        // for (var i=0; i < agent_id.length; i++) {
        //     console.log(agent_id[i])
        //     deposit = await model.getdeposit(agent_id[i]).catch(() => { throw err });
        //      withdraw = await model.getwithdraw(agent_id[i]).catch(() => { throw err });

        //     result  = deposit.concat(withdraw);
        //  }
        // let deposit = await model.getdeposit(body.memb_id).catch(() => { throw err });
        // let withdraw = await model.getwithdraw(body.memb_id).catch(() => { throw err });

       //let transaction = [...deposit, ...withdraw]
       // transaction = transaction.sort((a, b) => b.cr_date - a.cr_date);

        let skip = (Number(body.page) - 1) * Number(body.range);
        let range = Number(body.range);

        let get_transaction = await model.getbanktransaction(body.account_id).catch(() => { throw err });
        let get_bank = await model.getbank(body.account_id).catch(() => { throw err });
        res.send({
            status: "200",
            message: "success",
            total:get_transaction.length,
            result: {
                page_option: {
                    total_match: get_transaction.length,
                    now_page: Number(body.page),
                    total_match_page: Math.ceil(get_transaction.length / range),
                    start_rec: (skip + 1),
                    end_rec: (((skip + range) >= get_transaction.length) ? get_transaction.length : (skip + range))
                },
                bank:get_bank[0],
                transaction:get_transaction
            },
        }).end();
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

