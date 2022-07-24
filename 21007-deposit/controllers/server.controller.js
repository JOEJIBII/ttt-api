const model = require('../models/server.model');
const functions = require('../functions/server.function');
const moment = require('moment');
module.exports.deposit = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    console.log(payload)
    try {
        let getagentid = await model.getagentid(req.body).catch(() => { throw err });
        if (getagentid.length !== 0) {
            let bankfrom = await model.getbankfrom(req.body, getagentid[0]).catch(() => { throw err });
            let conf = (await model.getconfig_turnover(getagentid[0].agent_id).catch(() => { throw err }))[0];
            let bankto = []
            let turnover = null
            console.log("acc", req.body.account_deposit)
            if (req.body.account_deposit === null || req.body.account_deposit === "") {
                bankto = await model.getbanktobystatus(getagentid[0]).catch(() => { throw err });
                turnover = req.body * conf.turnover_config.bonus_multiplier
                console.log("getbanktobystatus", bankto)
            } else {
                bankto = await model.getbanktobyaccount_id(req.body, getagentid[0]).catch(() => { throw err });
                turnover = req.body * conf.turnover_config.cash_multiplier
                console.log("getbanktobyaccount_id", bankto)

            }
            let note = null
            let description = req.body.description.trim()
            if (description !== null && description !== "") {
                console.log("Description",req.body.description)
                note = []
                note = note.concat([{ username: payload.username, note: req.body.description, note_date: new Date(moment().format()) }])
                //note = note.concat([{ username: "System", note: "จำนวนการถอนของวันนี้ " + Counter.length, note_date: new Date(moment().format()) }])
            } 
            console.log("bankfrom", bankfrom)
            console.log("bankto", bankto)
            if (bankfrom.length !== 0 && bankto.length !== 0) {
                let getlastdeposit = await model.getlastdeposit(getagentid[0].agent_id, req.body.memb_id).catch(() => { throw err });
                let updatelastdeposit = await model.updatelastdeposit(getlastdeposit[0]._id).catch(() => { throw err });
                let Result = await model.InsertDocdeposit(req.body, payload, bankfrom[0], bankto[0], getagentid[0],note,turnover).catch(() => { throw err });
                if (Result.insertedId !== null && Result.insertedId !== '') {
                    const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
                    res.send({
                        status: "200",
                        message: "success",
                        result: Result.insertedId
                    }).end();
                } else {
                    res.send({ status: "201", message: 'can not deposit' }).end();
                }
            } else {
                res.send({ status: "202", message: 'not found bank' }).end();
            }
        } else {
            res.send({ status: "203", message: 'not found member' }).end();
        }


    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}
