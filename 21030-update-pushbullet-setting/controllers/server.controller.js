const model = require('../models/server.model');
const functions = require('../functions/server.function');
module.exports.updatepushbulletsetting = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const body = req.body
    const payload = JSON.parse(req.headers.payload)
    try {
        let Result = await functions.getiden(body, payload).catch(() => { throw err });
        if ("iden" in Result.result) {
            let updatepush = await model.updatepush(body, payload,Result.result.iden).catch(() => { throw err });
            console.log("updatepush",updatepush)
            if (updatepush.modifiedCount > 0 && updatepush.matchedCount > 0 || updatepush.upsertedCount > 0) {
                const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
                res.send({
                    status: "200",
                    message: "success",
                    result: Result
                }).end();
            } else if (updatepush.modifiedCount === 0 && updatepush.matchedCount > 0) {
                res.send({ status: "202", message: 'ไม่มีการอัพเดทข้อมูล' }).end();
            } else {
                res.send({ status: "201", message: 'update unsuccessful' }).end();
            }
        } else {
            res.send({ status: "203", message: Result.result.error.code }).end();
        }
    } catch (error) {
        res.send({ status: "300", message: 'internal error' }).end();
    }
}
