const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.getrole = async function (req, res) {
    const payload = JSON.parse(req.headers.payload)
    //console.log(payload)
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    try {
            
        let Result = await model.getrole().catch(() => { throw err });
       // console.log("query",Result,"emp_role",payload.role)
        if (Result && Result.length) {
            await functions.logs(req.body,req.headers.host).catch(() => {throw err});
            let responses = await functions.Mappingdata(Result,payload.role).catch(() => {throw err});
          //  console.log("Mappingdata",responses.role)
            res.send({
                status: "200",
                message: "success",
                result: responses.role
            }).end();
        } else {
            res.send({ status: "201", message: 'not found data' }).end();
        }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}
