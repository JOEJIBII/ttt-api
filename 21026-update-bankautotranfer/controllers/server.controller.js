const model = require('../models/server.model');
const functions = require('../functions/server.function');
module.exports.updatebankautotranfer = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const body = req.body
    const payload = JSON.parse(req.headers.payload)
    try {
        if(body.bank_auto_status === "active" || body.bank_auto_status === "suspend"){
            let Result = await model.updatebankactive(body,payload).catch(() => { throw err });
            console.log(Result)
            if (Result.modifiedCount > 0 && Result.matchedCount > 0) {
                const log = await functions.logs(req.body,req.headers.host).catch(() => {throw err});
                res.send({
                    status: "200",
                    message: "success",
                    result:Result
                }).end();
            } else if (Result.modifiedCount === 0 && Result.matchedCount > 0) {
                res.send({ status: "202", message: 'ไม่มีการอัพเดทข้อมูล'  }).end();
            }else{
                res.send({ status: "201", message: 'update unsuccessful' }).end();
            }
        }else if (body.bank_auto_status === "inactive"){
            let Result = await model.updatebankinactive(body,payload).catch(() => { throw err });
            console.log(Result)
            if (Result.modifiedCount > 0 && Result.matchedCount > 0) {
                const log = await functions.logs(req.body,req.headers.host).catch(() => {throw err});
                res.send({
                    status: "200",
                    message: "success",
                    result:Result
                }).end();
            } else if (Result.modifiedCount === 0 && Result.matchedCount > 0) {
                res.send({ status: "202", message: 'ไม่มีการอัพเดทข้อมูล'  }).end();
            }else{
                res.send({ status: "201", message: 'update unsuccessful' }).end();
            }
        }else{
            res.send({ status: "202", message: 'not found status in request' }).end();
        }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}
