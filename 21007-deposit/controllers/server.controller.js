const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.deposit = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    console.log(payload)
    try {
        let getagentid = await model.getagentid(req.body).catch(() => { throw err });
        let bankfrom = await model.getbankfrom(req.body,getagentid[0]).catch(() => { throw err });
        let bankto = await model.getbankto(req.body,getagentid[0]).catch(() => { throw err });
        console.log("bankfrom",bankfrom)
        console.log("bankto",bankto)

        let Result = await model.InsertDocdeposit(req.body,payload,bankfrom[0],bankto[0],getagentid[0]).catch(() => { throw err });
         if (Result.insertedId !== null && Result.insertedId !== '') {
            const log = await functions.logs(req.body,req.headers.host).catch(() => {throw err});
            res.send({
                status: "200",
                message: "success",
                result : Result.insertedId
            }).end();
        } else {
            res.send({ status: "201", message: 'can not deposit' }).end();
        }

    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}



//console.log(req.params.user)
  //  res.send({
    //    status: "200",
     //   param: req.params.user,
      //  message: "success",
    //}).end();