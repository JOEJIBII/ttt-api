const model = require('../models/server.model');
const moment = require('moment');
const functions = require('../functions/server.function');

module.exports.historybyId = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
   // console.log(payload)
    var history 
    try {
        console.log("body", body)
        let lock = await model.checklock(body.doc_id, body.type).catch(() => { throw err });
        lock = lock[0]
        console.log("lock", lock)
        const date = new Date(lock.lock_date)
        const future = 5 * 60 * 1000
        const newdate  = new Date(moment().format())
        date.setTime(date.getTime() + future)
       // console.log("ddd",date,"newdate",newdate)
        // if(newdate > date){
        //     console.log("if","ddd",date,"newdate",newdate)
        // }else{
        //     console.log("else","ddd",date,"newdate",newdate)
        // }
        if (body.type === "deposit") {
            history = await model.getdeposit(body.doc_id).catch(() => { throw err });

        } else {
            history = await model.getwithdraw(body.doc_id).catch(() => { throw err });
        }
        let lockby = lock.lock_by.toString()
        let user_id = payload.user_id.toString()
        if (lock.lock_status === "lock") {
            if (lockby === user_id) {
                let update = await model.updatelock(body.doc_id, payload, body.type).catch(() => { throw err });
                console.log("lock_by",lockby,"---------",user_id)
                res.send({
                    status: "200",
                    message: "success",
                    result: history[0]
                }).end();
            }
            else {
                if (newdate > date) {
                    let update = await model.updatelock(body.doc_id, payload, body.type).catch(() => { throw err });
                    console.log("newdate",newdate)
                    res.send({
                        status: "200",
                        message: "success",
                        result: history[0]
                    }).end();
                } else {
                    res.send({
                        status: "201",
                        message: "unsuccessful",
                        lock
                    }).end();
                }
            }
        } else {
            let update = await model.updatelock(body.doc_id, payload, body.type).catch(() => { throw err });
            console.log("lock","-------")
            res.send({
                status: "200",
                message: "success",
                result: history[0]
            }).end();
        }


        // if(lock.lock_status === "" || lock.lock_status === null){
        //     let deposit = await model.getdeposit().catch(() => { throw err });
        //     let withdraw = await model.getwithdraw().catch(() => { throw err });
        //     let result  = deposit.concat(withdraw);
        //     result = result.sort(function(a, b){return new Date(b.request_date) - new Date(a.request_date)})
        //             res.send({
        //                 status: "200",
        //                 message: "success",
        //                 result 
        //             }).end();
        // }else{
        //     res.send({
        //         status: "200",
        //         message: "success",
        //         result :lock[0]
        //     }).end();
        // }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

