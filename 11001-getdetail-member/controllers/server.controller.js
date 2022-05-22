const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.getdetailmember = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    console.log(JSON.parse(req.headers.payload))
    try {
            if (req.body.username !== null && req.body.username !== '') {
                // let CONF = await model.findConF(req.body).catch(() => {throw err});
                // console.log(CONF)
                let ResultMEMBER = await model.getdetailmember( req.body,JSON.parse(req.headers.payload)).catch(() => { throw err });
                    if (ResultMEMBER && ResultMEMBER.length) {
                        console.log('Result',ResultMEMBER)
                        const log = await functions.logs(req.body,ResultMEMBER[0]._id).catch(() => {throw err});
                        res.send({
                            status: "200",
                            message: "success",
                            result: ResultMEMBER[0]
                        }).end();
                    } else {
                        res.send({ status: "201", message: 'not found data' }).end();
                    }
                
            } else {
                res.send({ status: "203", message: 'invalid parameter' }).end();
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