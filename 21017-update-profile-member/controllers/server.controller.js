const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.updateprofile = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    try {
        console.log("body.agent_id", body.agent_id)
        let Result = await model.updatemember(body, payload).catch(() => { throw err });
        console.log("Result",Result)
        if (Result.modifiedCount === 1 || Result.modifiedCount === 0 && Result.matchedCount === 1) {
            
            let getbankmemb = await model.getbankmemb(body).catch(() => { throw err });
            console.log("getbankmemb",getbankmemb)
            
            if (getbankmemb.length > 0) {
                if (getbankmemb[0].account_number !== body.bank_account || getbankmemb[0].bank_id.toString() !== body.bank_id.toString()) {
                    let updatebankmemb = await model.updatebankmemb(body,payload).catch(() => { throw err });
                    console.log("updatebankmemb",updatebankmemb)
                    // if (updatebankmemb.modifiedCount > 0) {
                    //     let insertbankmemb = await model.insertbankmemb(body).catch(() => { throw err });
                        if (updatebankmemb.modifiedCount === 1 ||updatebankmemb.modifiedCount === 0 && updatebankmemb.matchedCount === 1) {
                            const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
                            res.send({
                                status: "200",
                                message: "success",
                            }).end();
                        // } else {
                        //     res.send({ status: "203", message: 'update ข้อมูลไม่สำเร็จ' }).end();
                        // }
                    } else {
                        res.send({ status: "203", message: 'update ข้อมูลไม่สำเร็จ' }).end();
                    }
                } else {
                    res.send({ status: "202", message: 'ไม่มีการอัพเดทข้อมูล' }).end();
                }
            } else {
                let insertbankmemb = await model.insertbankmemb(body).catch(() => { throw err });
                if (insertbankmemb.insertedId !== null && insertbankmemb.insertedId !== "") {
                    const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
                    res.send({
                        status: "200",
                        message: "success",
                    }).end();
                }
            }
        } else {
            res.send({ status: "201", message: '' }).end();
        }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}
