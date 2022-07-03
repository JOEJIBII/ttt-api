const model = require('../models/server.model');
const functions = require('../functions/server.function');
module.exports.insertbanking = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const body = req.body
    const payload = JSON.parse(req.headers.payload)
    try {
            console.log("body.agent_id",body.agent_id)
        let Result = await model.insertbank(body,payload).catch(() => { throw err });
        console.log(Result)
        if (Result.insertedId !== null || Result.insertedId !== "") {
            const log = await functions.logs(req.body,req.headers.host).catch(() => {throw err});
            res.send({
                status: "200",
                message: "success",
                result:Result
            }).end();
        } else {
            res.send({ status: "201", message: 'update unsuccessful' }).end();
        }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}
